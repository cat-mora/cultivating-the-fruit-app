describe("env", () => {
  const originalEnv = process.env;
  const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

  function loadEnvModule({
    processEnv = {},
    expoExtra = {},
  }: {
    processEnv?: Record<string, string>;
    expoExtra?: Record<string, string>;
  }) {
    jest.resetModules();

    const nextEnv = { ...originalEnv };
    delete nextEnv.EXPO_PUBLIC_SUPABASE_URL;
    delete nextEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    Object.assign(nextEnv, processEnv);
    process.env = nextEnv;

    jest.doMock("expo-constants", () => ({
      __esModule: true,
      default: {
        expoConfig: { extra: expoExtra },
        manifest: null,
        manifest2: null,
      },
    }));

    let envModule: typeof import("../../lib/env");
    jest.isolateModules(() => {
      envModule = require("../../lib/env");
    });

    return envModule!;
  }

  afterEach(() => {
    jest.resetModules();
    jest.dontMock("expo-constants");
    process.env = originalEnv;
  });

  afterAll(() => {
    warnSpy.mockRestore();
    process.env = originalEnv;
  });

  it("prefers process env values when both sources are present", () => {
    const env = loadEnvModule({
      processEnv: {
        EXPO_PUBLIC_SUPABASE_URL: "https://process.supabase.co",
        EXPO_PUBLIC_SUPABASE_ANON_KEY: "process-anon-key",
      },
      expoExtra: {
        EXPO_PUBLIC_SUPABASE_URL: "https://runtime.supabase.co",
        EXPO_PUBLIC_SUPABASE_ANON_KEY: "runtime-anon-key",
      },
    });

    expect(env.SUPABASE_URL).toBe("https://process.supabase.co");
    expect(env.SUPABASE_ANON_KEY).toBe("process-anon-key");
  });

  it("falls back to Expo runtime config when process env is missing", () => {
    const env = loadEnvModule({
      expoExtra: {
        EXPO_PUBLIC_SUPABASE_URL: "https://runtime.supabase.co",
        EXPO_PUBLIC_SUPABASE_ANON_KEY: "runtime-anon-key",
      },
    });

    expect(env.SUPABASE_URL).toBe("https://runtime.supabase.co");
    expect(env.SUPABASE_ANON_KEY).toBe("runtime-anon-key");
  });
});

# 🚨 Manual Testing Required

## Relational Handshake Feature

The **Relational Handshake** feature (partner linking/sharing) requires manual end-to-end testing on **two real devices**.

### Why Manual Testing Is Needed

This feature involves:
- Device-to-device communication
- QR code scanning
- Real-time synchronization between two users
- Cross-device state management

These cannot be adequately tested in a development environment or on a single device.

### Testing Checklist

**Prerequisites:**
- [ ] Two physical devices (can be different platforms: iOS + Android, etc.)
- [ ] Both devices have the app installed
- [ ] Both devices have active internet connection

**Test Scenarios:**

1. **Partner Linking Flow**
   - [ ] User A initiates "Relational Handshake" from Settings
   - [ ] User A's QR code is displayed
   - [ ] User B scans QR code on their device
   - [ ] Both users see confirmation of successful link
   - [ ] Both users' partner names are displayed correctly

2. **Progress Sharing**
   - [ ] User A completes an activity
   - [ ] User B sees User A's progress update
   - [ ] User B completes an activity
   - [ ] User A sees User B's progress update
   - [ ] Progress syncs correctly across both devices

3. **Unlinking**
   - [ ] User A unlinks from Settings
   - [ ] User B sees unlink notification
   - [ ] Both users can no longer see each other's progress
   - [ ] Both users can link with new partners

4. **Edge Cases**
   - [ ] One user offline when partner completes activity (sync on reconnect)
   - [ ] Both users complete activities at same time
   - [ ] User tries to scan invalid QR code
   - [ ] User tries to scan their own QR code

### How to Test

1. **Install the app on both devices:**
   - Visit the deployment URL or install PWA

2. **Follow the testing checklist above**

3. **Document any issues:**
   - Screenshot or video of unexpected behavior
   - Steps to reproduce
   - Device models and OS versions

### Test Results

**Date:** _____________

**Tester:** _____________

**Devices Used:**
- Device 1: _____________
- Device 2: _____________

**Results:**
- [ ] All tests passed
- [ ] Issues found (see below)

**Issues Found:**

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

**⚠️ Important:** Do not consider this feature production-ready until all test scenarios pass successfully on real devices.

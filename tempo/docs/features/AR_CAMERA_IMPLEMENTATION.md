# Tempo - AR Camera Implementation Guide

## Overview

Tempo uses native AR (ARKit for iOS, ARCore for Android) to display real-time camera feeds with golf-specific overlays. MVP focuses on course visualization with distance/yardage markers; Phase 1+ adds slope detection and lie recognition.

---

## MVP Features (Phase 0)

### Camera Feed
- Live camera stream covering full device screen
- 30+ FPS target (smooth real-time performance)
- Auto-focus on golfer's location
- Tap to focus (manual override)

### Distance Overlay
- Flagstick distance in yards (to center, front, back)
- Hazard distances (water, bunkers, OB)
- Target line overlay (optional, can toggle off)
- Units toggle: Yards ↔ Meters

### UI Sidebar
- Course/hole info (Pebble Beach, Hole 7, Par 4)
- Tee type selected (Blue 415y, White 380y, Red 340y)
- Wind direction & speed (if API available)
- Current weather (temp, conditions)
- Buttons: Shot log, pause, settings

### Controls
- **Press and hold**: Lock AR position (freeze frame)
- **Tap screen**: Focus on that location
- **Swipe up**: Expand sidebar details
- **Swipe down**: Minimize sidebar
- **X button**: Exit to map view

---

## Tech Stack

### iOS (ARKit)
```
React Native Vision Camera + Native Bridge
           ↓
    ARKit (Metal rendering)
           ↓
    Core Location + Core Motion
           ↓
    Backend API (distances)
```

**Dependencies:**
```json
{
  "react-native-vision-camera": "^3.8.0",
  "react-native-worklets-core": "^0.4.0",
  "react-native-reanimated": "^3.5.0",
  "@react-native-community/geolocation": "^3.2.0"
}
```

### Android (ARCore)
```
React Native Vision Camera + Native Bridge
           ↓
    ARCore (Vulkan rendering)
           ↓
    Google Play Services (location, sensors)
           ↓
    Backend API (distances)
```

**Dependencies:**
```gradle
implementation 'com.google.ar:core:1.45.0'
implementation 'com.google.ar:arcore'
```

---

## Phase 0 Implementation: Distance Overlay

### Step 1: Camera Setup

```javascript
// screens/ARCamera.tsx
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useSharedValue } from 'react-native-reanimated';

export function ARCameraScreen() {
  const device = useCameraDevice('back');
  const frameProcessor = useSharedValue(null);

  if (device == null) return <LoadingScreen />;

  return (
    <Camera
      style={{ flex: 1 }}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      photo={true}
      video={true}
    >
      <DistanceOverlay />
      <ARSidebar />
    </Camera>
  );
}
```

### Step 2: Fetch Distances from Backend

```javascript
// When user opens AR camera, fetch distances to flagstick & hazards
const fetchARData = async (courseId, holeNumber, gpsCoords) => {
  const response = await API.post('/courses/{courseId}/ar-data', {
    hole_number: holeNumber,
    user_gps: gpsCoords, // { lat, lng }
    tee_type: 'blue'
  });
  
  return {
    flagDistance: 185, // yards
    frontDistance: 170,
    backDistance: 205,
    hazards: [
      { name: 'Water left', distance: 120, bearing: 270 },
      { name: 'Bunker right', distance: 140, bearing: 90 }
    ],
    slope: 2 // degrees (Phase 1+)
  };
};
```

### Step 3: Render Distance Overlay

```javascript
// components/DistanceOverlay.tsx
import { Canvas } from '@react-three/fiber/native';
import { useFrame } from '@react-three/fiber';

export function DistanceOverlay() {
  const [distances, setDistances] = useState(null);
  const [cameraOrientation, setCameraOrientation] = useState(0); // degrees

  useEffect(() => {
    // Listen to device orientation (compass)
    const unsubscribe = DeviceEventEmitter.addListener(
      'compassHeading',
      (event) => {
        setCameraOrientation(event.heading);
      }
    );
    return () => unsubscribe.remove();
  }, []);

  const calculateScreenPosition = (bearing, distance) => {
    // Convert bearing to screen X position
    // bearing 0 = north (top), 90 = east (right), 180 = south (bottom), 270 = west (left)
    
    const relativeAngle = (bearing - cameraOrientation + 360) % 360;
    const screenX = (relativeAngle / 360) * screenWidth;
    const screenY = (distance / 250) * screenHeight; // Normalize distance
    
    return { x: screenX, y: screenY };
  };

  if (!distances) return null;

  return (
    <View style={styles.overlay}>
      {/* Flagstick distance - center top */}
      <View style={styles.centerMarker}>
        <Text style={styles.distance}>{distances.flagDistance}y</Text>
        <Text style={styles.label}>Flag</Text>
      </View>

      {/* Hazards */}
      {distances.hazards.map((hazard) => {
        const pos = calculateScreenPosition(hazard.bearing, hazard.distance);
        return (
          <View
            key={hazard.name}
            style={[
              styles.hazardMarker,
              { left: pos.x, top: pos.y }
            ]}
          >
            <Icon name={getHazardIcon(hazard.name)} size={24} color="red" />
            <Text style={styles.hazardLabel}>{hazard.distance}y</Text>
          </View>
        );
      })}
    </View>
  );
}
```

### Step 4: Compass Integration

```javascript
// hooks/useCompass.ts
import { magnetometer } from 'react-native-sensors';

export function useCompass() {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const subscription = magnetometer.subscribe(({ x, y, z }) => {
      // Calculate heading from magnetometer values
      const rad = Math.atan2(y, x);
      const deg = (rad * 180) / Math.PI;
      const heading = (deg + 360) % 360; // Normalize to 0-360
      
      setHeading(heading);
    });

    return () => subscription.unsubscribe();
  }, []);

  return heading;
}
```

---

## Phase 1: Slope Detection

### ARKit Plane Detection

```javascript
// For ARKit: Use ARPlaneAnchor to detect ground plane
// Native bridge: ios/ARSlope.swift

import ARKit

class ARSlopeDetector: NSObject, ARSessionDelegate {
  func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
    for anchor in anchors {
      if let planeAnchor = anchor as? ARPlaneAnchor {
        // Plane detected - calculate slope from normal vector
        let normal = planeAnchor.extent // Normal to the plane surface
        
        // Slope = angle between plane normal and vertical (up)
        // Vertical vector = (0, 1, 0)
        let vertical = simd_float3(0, 1, 0)
        let dotProduct = simd_dot(normal, vertical)
        let angleRadians = acos(dotProduct)
        let angleDegrees = angleRadians * 180 / Float.pi
        
        // Send slope to React Native
        sendEvent("slopeDetected", ["slope": angleDegrees])
      }
    }
  }
}
```

### Accelerometer + Gyroscope Fusion

```javascript
// hooks/useSlopeFromSensors.ts
import { accelerometer, gyroscope } from 'react-native-sensors';

export function useSlopeFromSensors() {
  const [slope, setSlope] = useState(0);

  useEffect(() => {
    // Fuse accelerometer (gravity vector) + gyroscope (rotation rate)
    let accelData = { x: 0, y: 0, z: 0 };
    let gyroData = { x: 0, y: 0, z: 0 };

    const accelSub = accelerometer.subscribe(({ x, y, z }) => {
      accelData = { x, y, z };
      updateSlope();
    });

    const gyroSub = gyroscope.subscribe(({ x, y, z }) => {
      gyroData = { x, y, z };
    });

    function updateSlope() {
      // Gravity vector = accelerometer (magnitude ~9.8 m/s²)
      // Slope = angle between gravity vector and vertical
      const gravityMagnitude = Math.sqrt(
        accelData.x ** 2 + accelData.y ** 2 + accelData.z ** 2
      );

      // angle from vertical (z-axis usually points up)
      const angleRad = Math.acos(Math.abs(accelData.z) / gravityMagnitude);
      const angleDeg = (angleRad * 180) / Math.PI;

      setSlope(Math.round(angleDeg * 10) / 10); // Round to 0.1°
    }

    return () => {
      accelSub.unsubscribe();
      gyroSub.unsubscribe();
    };
  }, []);

  return slope;
}
```

### Display Slope Overlay

```javascript
// Phase 1: Show slope on camera
<View style={styles.slopeDisplay}>
  <Icon name="mountain" size={24} color="orange" />
  <Text style={styles.slopeText}>
    {slope > 0 ? '↑' : '↓'} {Math.abs(slope).toFixed(1)}°
  </Text>
</View>
```

---

## Phase 2: Lie Detection (TensorFlow Lite)

### Model Selection

**Recommended**: MobileNetV3 fine-tuned on grass/lie images
- Input: 224×224 RGB image
- Output: Classification (fairway, rough, bunker, water, etc.)
- Size: ~4-8 MB (fits on device)
- Latency: ~100ms per inference

**Training Data**:
- Use golf course images labeled by lie type
- Dataset: 1000+ images per class
- Augmentation: Rotation, lighting changes, zoom variations

### Installation

```bash
# Install TensorFlow Lite React Native
npm install react-native-tf-lite
```

### Implementation

```javascript
// hooks/useLieDetection.ts
import TfLite from 'react-native-tf-lite';

export function useLieDetection(frameRef) {
  const [lie, setLie] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    // Load model
    TfLite.loadModel({
      model: 'lie_detector_v1.tflite',
      labels: ['fairway', 'rough', 'bunker', 'water', 'obb'], // off-bound bunker
    });
  }, []);

  const detectLie = async (frame) => {
    try {
      // Extract frame and resize to 224x224
      const input = await resizeFrame(frame, 224, 224);

      // Run inference
      const output = await TfLite.runInference(input);

      // output format: { predictions: [0.85, 0.10, 0.03, 0.02, 0.0] }
      const lieProbabilities = output.predictions;
      const lieBestIdx = lieProbabilities.indexOf(Math.max(...lieProbabilities));
      const lieTypes = ['fairway', 'rough', 'bunker', 'water', 'obb'];
      const detectedLie = lieTypes[lieBestIdx];
      const conf = (lieProbabilities[lieBestIdx] * 100).toFixed(0);

      setLie(detectedLie);
      setConfidence(conf);

      return { lie: detectedLie, confidence: conf };
    } catch (err) {
      console.error('Lie detection error:', err);
    }
  };

  return { lie, confidence, detectLie };
}
```

### Display Lie Badge

```javascript
// Show lie detection result (Phase 2+)
{lie && confidence > 60 && (
  <View style={styles.lieBadge}>
    <Icon name={getLieIcon(lie)} size={20} color="white" />
    <Text style={styles.lieLabel}>{lie} ({confidence}%)</Text>
  </View>
)}
```

---

## Performance Optimization

### Frame Processing Pipeline

```javascript
// Process every nth frame to reduce CPU load
let frameCount = 0;
const FRAME_SKIP = 3; // Process every 3rd frame (10 FPS instead of 30)

const processFrame = (frame) => {
  frameCount++;
  if (frameCount % FRAME_SKIP !== 0) return; // Skip frame

  // Do expensive computation (slope, lie detection)
  updateSlopeAndLie(frame);
};
```

### Memory Management

```javascript
// Prevent memory leaks from continuous frame processing
useEffect(() => {
  return () => {
    // Cleanup on unmount
    TfLite.close();
    compassSubscription?.remove();
    accelSubscription?.unsubscribe();
  };
}, []);
```

### Battery Optimization

```javascript
// Reduce GPS polling frequency while in AR mode
const configureGPS = () => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    accuracy: {
      android: 'high', // ACCURACY_HIGH
      ios: 'best' // kCLLocationAccuracyBest
    },
    enableBackgroundLocationUpdates: false,
    locationProvider: 'auto',
  });

  // Update location every 5 seconds (not every frame)
  Geolocation.watchPosition(
    (position) => onLocationUpdate(position),
    (error) => console.error(error),
    { timeout: 5000, maximumAge: 5000 }
  );
};
```

---

## Error Handling

### Camera Permissions

```javascript
const requestCameraPermission = async () => {
  try {
    const status = await Camera.requestCameraPermission();
    
    if (status === 'authorized') {
      setHasPermission(true);
    } else if (status === 'denied') {
      Alert.alert(
        'Camera Permission',
        'Tempo needs camera access for AR features',
        [
          { text: 'Cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings()
          }
        ]
      );
    }
  } catch (err) {
    console.error('Permission request error:', err);
  }
};
```

### Graceful Degradation

```javascript
// If AR not available (old device), fall back to map view
const ARCameraScreen = () => {
  if (!isARKitAvailable()) {
    return <MapViewScreen />;
  }
  return <ARCameraView />;
};

// Check ARKit availability
const isARKitAvailable = () => {
  return (
    Platform.OS === 'ios' &&
    Math.floor(Platform.Version) >= 11 &&
    device?.supportsFocus // Check device capabilities
  );
};
```

---

## Testing Strategy

### Unit Tests
```javascript
// __tests__/distanceOverlay.test.ts
test('calculateScreenPosition converts bearing to screen X', () => {
  const result = calculateScreenPosition(90, 150); // East bearing
  expect(result.x).toBeGreaterThan(0); // Should be on right side
});

test('slope calculation from accelerometer', () => {
  const slope = calculateSlopeFromAccel({ x: 0, y: 9.8, z: 0 }); // Flat
  expect(slope).toBeLessThan(5); // Should be near 0°
});
```

### Integration Tests
```javascript
// e2e/arCamera.test.ts
test('AR camera opens and displays distance overlay', async () => {
  await openARCamera();
  
  const flagDistance = await element(by.id('flag-distance'));
  await expect(flagDistance).toBeVisible();
  await expect(flagDistance).toHaveText(/\d+y/); // Matches "185y" pattern
});

test('Changing tee type updates distances', async () => {
  await selectTeeMeter('white'); // 380 yards
  const flagDistance = await element(by.id('flag-distance')).getAttributes();
  expect(parseInt(flagDistance.text)).toBeLessThan(415); // Blue was 415y
});
```

### Manual Testing Checklist
- [ ] Camera opens without delay (<1s)
- [ ] Distances update as user moves (+/- 10y accuracy)
- [ ] Overlay remains stable while panning camera
- [ ] Frame rate consistent (30+ FPS, no drops)
- [ ] Compass heading matches actual direction
- [ ] Slope detection within ±2° of actual (Phase 1+)
- [ ] Lie detection >80% accurate (Phase 2+)
- [ ] No crashes with rapid permission changes
- [ ] Works offline (shows cached distances)
- [ ] Low battery indicator appears <20%

---

## API Endpoints

### Get AR Data
```
POST /courses/{courseId}/ar-data

Request:
{
  "hole_number": 7,
  "user_gps": { "lat": 36.5622, "lng": -121.9489 },
  "tee_type": "blue"
}

Response:
{
  "flagDistance": 185,
  "frontDistance": 170,
  "backDistance": 205,
  "hazards": [
    { "name": "Water left", "distance": 120, "bearing": 270 },
    { "name": "Bunker right", "distance": 140, "bearing": 90 }
  ],
  "slope": null, // Phase 1+
  "lie": null    // Phase 2+
}
```

---

## Accessibility

### VoiceOver Support (iOS)
```javascript
<View
  accessible={true}
  accessibilityLabel="Flag distance overlay"
  accessibilityValue={{
    min: 0,
    max: 300,
    current: 185,
    text: "185 yards to flag"
  }}
>
  <Text>185y</Text>
</View>
```

### Dynamic Text Size
```javascript
const fontSize = useWindowDimensions().scale * 16; // Respects system setting
```

---

## Future Enhancements (Phase 2+)

- **Point of Interest (POI) Labels**: Show course features (water hazards, bunkers, trees) as AR anchors
- **Swing Path Visualization**: Show club path overlay during swing (requires pose estimation)
- **Wind Direction**: Show wind arrow based on device orientation + weather API
- **Playability Surface**: Highlight playable areas (fairway vs rough) using lie detection
- **Multiplayer AR**: See other golfers' positions in real-time (Phase 2)

---

**Last Updated**: December 6, 2025  
**Version**: MVP-AR-1.0  
**Lead**: [AR Specialist Name]

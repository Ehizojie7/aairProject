import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

type VoiceInputState = 'idle' | 'listening' | 'processing' | 'error';

interface VoiceInputProps {
  onTranscriptionComplete: (transcription: string) => void;
  onError?: (error: string) => void;
}

// Declare SpeechRecognition types for TypeScript (Web only)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceInput({ onTranscriptionComplete, onError }: VoiceInputProps) {
  const [state, setState] = useState<VoiceInputState>('idle');
  const [transcript, setTranscript] = useState('');
  const colorScheme = useColorScheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recognitionRef = useRef<any>(null);
  const webViewRef = useRef<WebView>(null);

  // Check if speech recognition is supported
  const isSpeechRecognitionSupported = () => {
    if (Platform.OS === 'web') {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }
    // For mobile, we'll use WebView with enhanced permissions
    return true;
  };

  useEffect(() => {
    if (state === 'listening') {
      // Start pulsing animation
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (state === 'listening') {
            pulse();
          }
        });
      };
      pulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state, pulseAnim]);

  const startWebSpeechRecognition = () => {
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setState('listening');
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          console.log('Web speech final transcript:', finalTranscript);
          setState('processing');
          setTimeout(() => {
            onTranscriptionComplete(finalTranscript.trim());
            setState('idle');
            setTranscript('');
          }, 500);
        }
      };

      recognition.onerror = (event: any) => {
        setState('error');
        onError?.(event.error || 'Speech recognition error');
        setTimeout(() => setState('idle'), 2000);
      };

      recognition.onend = () => {
        if (state === 'listening') {
          setState('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setState('error');
      onError?.('Failed to start speech recognition');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  const startMobileVoiceInput = () => {
    setState('listening');
    setTranscript('');
    
    // Send message to WebView to start speech recognition
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ action: 'start' }));
    }
  };

  const startListening = async () => {
    if (Platform.OS === 'web') {
      if (!isSpeechRecognitionSupported()) {
        onError?.('Speech recognition is not supported on this browser');
        return;
      }
      startWebSpeechRecognition();
    } else {
      startMobileVoiceInput();
    }
  };

  const stopListening = () => {
    if (Platform.OS === 'web' && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ action: 'stop' }));
    }
    setState('idle');
    setTranscript('');
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', data);
      
      if (data.type === 'transcript') {
        setTranscript(data.transcript);
      } else if (data.type === 'final') {
        console.log('Final transcript:', data.transcript);
        setState('processing');
        setTimeout(() => {
          onTranscriptionComplete(data.transcript.trim());
          setState('idle');
          setTranscript('');
        }, 500);
      } else if (data.type === 'error') {
        console.log('Speech recognition error:', data.message);
        setState('error');
        
        // If it's a permission error, provide a helpful fallback
        if (data.message === 'not-allowed' || data.message.includes('permission')) {
          onError?.('Microphone permission denied. Showing text input instead...');
          setTimeout(() => {
            setState('idle');
            showTextInputFallback();
          }, 2000);
        } else {
          onError?.(data.message || 'Speech recognition error');
          setTimeout(() => setState('idle'), 2000);
        }
      } else if (data.type === 'ready') {
        console.log('WebView speech recognition ready');
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const showTextInputFallback = () => {
    Alert.prompt(
      'Add Multiple Tasks',
      'Type your tasks separated by "and" or commas. The app will intelligently split them!\n\nExample: "Buy groceries and call mom"',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add Tasks',
          onPress: (text) => {
            if (text && text.trim()) {
              setState('processing');
              setTimeout(() => {
                onTranscriptionComplete(text.trim());
                setState('idle');
              }, 500);
            }
          }
        }
      ],
      'plain-text',
      'Buy groceries and call mom',
      'default'
    );
  };

  const getButtonColor = () => {
    switch (state) {
      case 'listening':
        return '#FF6B6B';
      case 'processing':
        return '#4ECDC4';
      case 'error':
        return '#FF4757';
      default:
        return '#007AFF';
    }
  };

  const getButtonIcon = () => {
    switch (state) {
      case 'listening':
        return 'mic.fill';
      case 'processing':
        return 'checkmark.circle.fill';
      case 'error':
        return 'exclamationmark.triangle.fill';
      default:
        return 'mic';
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'error':
        return 'Error occurred';
      default:
        return 'Tap to speak';
    }
  };

  // Enhanced HTML with better mobile support
  const speechRecognitionHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <style>
        body { 
          margin: 0; 
          padding: 20px; 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: transparent;
          text-align: center;
          touch-action: manipulation;
        }
        .status { 
          font-size: 16px; 
          margin: 20px 0; 
          color: #333;
        }
        .transcript {
          font-size: 14px;
          font-style: italic;
          color: #666;
          margin: 10px 0;
          min-height: 20px;
        }
        .button {
          background: #007AFF;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin: 10px;
        }
      </style>
    </head>
    <body>
      <div class="status" id="status">Initializing...</div>
      <div class="transcript" id="transcript"></div>
      
      <script>
        let recognition = null;
        let isListening = false;
        
        function log(message) {
          console.log(message);
          document.getElementById('status').textContent = message;
        }
        
        function initSpeechRecognition() {
          log('Checking speech recognition support...');
          
          if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            log('Using webkitSpeechRecognition');
          } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
            log('Using SpeechRecognition');
          } else {
            log('Speech recognition not supported');
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: 'Speech recognition not supported on this device'
            }));
            return false;
          }
          
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          recognition.maxAlternatives = 1;
          
          recognition.onstart = () => {
            isListening = true;
            log('Listening... Speak now!');
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'status',
              message: 'listening'
            }));
          };
          
          recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }
            
            const displayTranscript = finalTranscript || interimTranscript;
            document.getElementById('transcript').textContent = displayTranscript;
            
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'transcript',
              transcript: displayTranscript
            }));
            
            if (finalTranscript) {
              log('Speech recognition complete');
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'final',
                transcript: finalTranscript
              }));
            }
          };
          
          recognition.onerror = (event) => {
            isListening = false;
            log('Error: ' + event.error);
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: event.error
            }));
          };
          
          recognition.onend = () => {
            isListening = false;
            log('Speech recognition ended');
          };
          
          return true;
        }
        
        function startListening() {
          if (recognition && !isListening) {
            try {
              recognition.start();
            } catch (error) {
              log('Failed to start: ' + error.message);
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: error.message
              }));
            }
          }
        }
        
        function stopListening() {
          if (recognition && isListening) {
            recognition.stop();
          }
        }
        
        // Initialize when page loads
        window.addEventListener('load', () => {
          log('WebView loaded');
          
          // Request microphone permission first
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(() => {
                log('Microphone permission granted');
                if (initSpeechRecognition()) {
                  log('Speech recognition initialized');
                  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'ready'
                  }));
                }
              })
              .catch((error) => {
                log('Microphone permission denied: ' + error.message);
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  message: 'Microphone permission required'
                }));
              });
          } else {
            // Fallback for older browsers
            if (initSpeechRecognition()) {
              log('Speech recognition initialized (no permission check)');
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ready'
              }));
            }
          }
        });
        
        // Listen for messages from React Native
        window.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.action === 'start') {
              startListening();
            } else if (data.action === 'stop') {
              stopListening();
            }
          } catch (error) {
            log('Message parsing error: ' + error.message);
          }
        });
        
        // Handle document messages (for React Native WebView)
        document.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.action === 'start') {
              startListening();
            } else if (data.action === 'stop') {
              stopListening();
            }
          } catch (error) {
            log('Document message parsing error: ' + error.message);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Pressable
          onPress={state === 'listening' ? stopListening : startListening}
          style={[
            styles.voiceButton,
            { backgroundColor: getButtonColor() },
            state === 'listening' && styles.listeningButton,
          ]}
          disabled={state === 'processing'}
        >
          <IconSymbol size={32} name={getButtonIcon()} color="#fff" />
        </Pressable>
      </Animated.View>
      
      <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
      
      {transcript && (
        <ThemedView style={[
          styles.transcriptContainer,
          { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }
        ]}>
          <ThemedText style={styles.transcriptText}>{transcript}</ThemedText>
        </ThemedView>
      )}
      
      {state === 'idle' && (
        <ThemedView style={styles.instructionsContainer}>
          <ThemedText style={styles.hintText}>
            Say something like: &quot;Buy groceries and call mom&quot;
          </ThemedText>
          {Platform.OS !== 'web' && (
            <ThemedText style={styles.mobileNote}>
              🎤 Real voice recognition on mobile! (with text fallback if needed)
            </ThemedText>
          )}
        </ThemedView>
      )}

      {/* Enhanced WebView for mobile speech recognition */}
      {Platform.OS !== 'web' && (
        <View style={styles.hiddenWebView}>
          <WebView
            ref={webViewRef}
            source={{ html: speechRecognitionHTML }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            mixedContentMode="compatibility"
            onPermissionRequest={(request) => {
              console.log('WebView permission request:', request);
              request.grant();
            }}
            style={{ height: 1, width: 1 }}
            // Enhanced mobile support
            allowsFullscreenVideo={false}
            allowsBackForwardNavigationGestures={false}
            bounces={false}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  listeningButton: {
    elevation: 8,
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  transcriptContainer: {
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: 300,
  },
  transcriptText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  instructionsContainer: {
    alignItems: 'center',
    gap: 8,
  },
  hintText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    maxWidth: 250,
  },
  mobileNote: {
    fontSize: 10,
    opacity: 0.5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  hiddenWebView: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 1,
    height: 1,
    opacity: 0,
  },
});
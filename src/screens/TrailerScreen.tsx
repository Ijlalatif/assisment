import {useRef} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Trailer'>;

function playerHtml(videoKey: string) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      html, body, #player { margin: 0; height: 100%; background: #000; }
    </style>
  </head>
  <body>
    <div id="player"></div>
    <script src="https://www.youtube.com/iframe_api"></script>
    <script>
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          width: '100%',
          height: '100%',
          videoId: '${videoKey}',
          playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1, controls: 1 },
          events: {
            onReady: function (event) { event.target.playVideo(); },
            onStateChange: function (event) {
              if (event.data === 0 && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('ended');
              }
            }
          }
        });
      }
    </script>
  </body>
</html>`;
}

export function TrailerScreen({route, navigation}: Props) {
  const {videoKey} = route.params;
  const insets = useSafeAreaInsets();
  const closed = useRef(false);

  const close = () => {
    if (closed.current) {
      return;
    }
    closed.current = true;
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <WebView
        style={styles.player}
        source={{html: playerHtml(videoKey), baseUrl: 'https://www.youtube.com'}}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        onMessage={event => {
          if (event.nativeEvent.data === 'ended') {
            close();
          }
        }}
      />
      <Pressable style={[styles.done, {top: insets.top + 12}]} onPress={close}>
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
    backgroundColor: '#000',
  },
  done: {
    position: 'absolute',
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

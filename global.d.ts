import 'react-native';

declare module 'react-native' {
    interface SafeAreaViewProps {
        className?: string;
    }
}
interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: Function;
  }
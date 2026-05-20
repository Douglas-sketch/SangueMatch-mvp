import { useApp } from '../context/AppContext';

const SCALES = {
  small: 0.875,
  normal: 1,
  large: 1.2,
};

export function useFontScale() {
  const { accessibility } = useApp();
  return SCALES[accessibility?.fontScale] ?? 1;
}

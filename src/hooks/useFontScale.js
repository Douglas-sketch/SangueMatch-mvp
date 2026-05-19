import { useApp } from '../context/AppContext';

<<<<<<< HEAD
const SCALES = { small: 0.875, normal: 1, large: 1.2 };

export function useFontScale() {
  const { accessibility } = useApp();
  return SCALES[accessibility.fontScale] ?? 1;
=======
const SCALES = {
  small: 0.875,
  normal: 1,
  large: 1.2,
};

export function useFontScale() {
  const { accessibility } = useApp();
  return SCALES[accessibility?.fontScale] ?? 1;
>>>>>>> 78fb240 (Correções)
}

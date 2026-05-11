import { useAppSelector } from '../redux/hooks.js';

export default function useAuth() {
  return useAppSelector((state) => state.auth);
}

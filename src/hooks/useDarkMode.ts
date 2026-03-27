import { useSettingsStore } from '../store/settingsStore';
import { lightColors, darkColors } from '../theme/colors';
import type { AppColors } from '../theme/colors';

interface UseDarkModeReturn {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: AppColors;
}

function useDarkMode(): UseDarkModeReturn {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const toggleDarkMode = useSettingsStore((state) => state.toggleDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;
  return { isDarkMode, toggleDarkMode, colors };
}

export default useDarkMode;

import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback } from 'react';
import { UserSettings } from '@/types';

interface UseUserShortcutsProps {
  settings?: UserSettings;
  onResetExercise: () => void;
  onToggleHint: () => void;
  onPlayPronunciation: () => void;
  onNavigateWord: (direction: 'left' | 'right') => void;
  onNext: (() => void) | undefined;
  onPrev: (() => void) | undefined;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const useUserShortcuts = ({
  settings,
  onResetExercise,
  onToggleHint,
  onPlayPronunciation,
  onNavigateWord,
  onNext,
  onPrev,
  inputRef
}: UseUserShortcutsProps) => {
  // 格式化快捷键为 react-hotkeys-hook 格式
  const formatShortcut = useCallback(
    (shortcut: { key: string; modifiers: string[] }) => {
      if (!shortcut.key) return '';

      const modifiers = shortcut.modifiers.map(mod => {
        switch (mod) {
          case 'ctrl':
            return 'ctrl';
          case 'meta':
            return 'meta';
          case 'alt':
            return 'alt';
          case 'shift':
            return 'shift';
          case 'option':
            return 'alt'; // Mac 上 Option 对应 alt
          default:
            return mod;
        }
      });

      // 处理特殊键名映射 - react-hotkeys-hook 使用标准键名
      let key = shortcut.key;
      if (key === 'space') {
        key = 'space';
      } else if (key === 'left' || key === 'arrowleft') {
        key = 'arrowleft';
      } else if (key === 'right' || key === 'arrowright') {
        key = 'arrowright';
      } else if (key === 'up' || key === 'arrowup') {
        key = 'arrowup';
      } else if (key === 'down' || key === 'arrowdown') {
        key = 'arrowdown';
      } else {
        key = key.toLowerCase();
      }

      return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
    },
    []
  );

  // 重置练习快捷键
  const resetShortcut = settings?.shortcuts?.resetExercise
    ? formatShortcut(settings.shortcuts.resetExercise)
    : 'ctrl+r';

  useHotkeys(
    resetShortcut,
    useCallback(
      event => {
        event.preventDefault();
        event.stopPropagation();
        onResetExercise();
        inputRef.current?.focus();
      },
      [onResetExercise, inputRef]
    ),
    {
      enableOnFormTags: true,
      preventDefault: true
    }
  );

  // 切换提示快捷键
  const hintShortcut = settings?.shortcuts?.toggleHint
    ? formatShortcut(settings.shortcuts.toggleHint)
    : 'ctrl+h';

  useHotkeys(
    hintShortcut,
    useCallback(
      event => {
        event.preventDefault();
        event.stopPropagation();
        onToggleHint();
        inputRef.current?.focus();
      },
      [onToggleHint, inputRef]
    ),
    {
      enableOnFormTags: true,
      preventDefault: true
    }
  );

  // 播放发音快捷键
  const pronunciationShortcut = settings?.shortcuts?.pronunciation
    ? formatShortcut(settings.shortcuts.pronunciation)
    : 'ctrl+p';

  useHotkeys(
    pronunciationShortcut,
    useCallback(
      event => {
        event.preventDefault();
        event.stopPropagation();
        onPlayPronunciation();
        inputRef.current?.focus();
      },
      [onPlayPronunciation, inputRef]
    ),
    {
      enableOnFormTags: true,
      preventDefault: true
    }
  );

  // 单词导航快捷键
  const prevShortcut = settings?.shortcuts?.wordNavigation?.prev
    ? formatShortcut(settings.shortcuts.wordNavigation.prev)
    : 'ctrl+arrowleft';

  useHotkeys(
    prevShortcut,
    useCallback(
      event => {
        event.preventDefault();
        event.stopPropagation();
        onNavigateWord('left');
        inputRef.current?.focus();
      },
      [onNavigateWord, inputRef]
    ),
    {
      enableOnFormTags: true,
      preventDefault: true
    }
  );

  const nextShortcut = settings?.shortcuts?.wordNavigation?.next
    ? formatShortcut(settings.shortcuts.wordNavigation.next)
    : 'ctrl+arrowright';

  useHotkeys(
    nextShortcut,
    useCallback(
      event => {
        event.preventDefault();
        event.stopPropagation();
        onNavigateWord('right');
        inputRef.current?.focus();
      },
      [onNavigateWord, inputRef]
    ),
    {
      enableOnFormTags: true,
      preventDefault: true
    }
  );

  useHotkeys(
    nextShortcut || '',
    useCallback(
      event => {
        event.preventDefault();
        event.stopPropagation();
        onNext?.();
        inputRef.current?.focus();
      },
      [onNext, inputRef]
    ),
    {
      enableOnFormTags: true,
      preventDefault: true
    }
  );

  useHotkeys(
    prevShortcut || '',
    useCallback(
      event => {
        event.preventDefault();
        event.stopPropagation();
        onPrev?.();
        inputRef.current?.focus();
      },
      [onPrev, inputRef]
    ),
    {
      enableOnFormTags: true,
      preventDefault: true
    }
  );
};

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKINS, Skin, SkinId } from './index';

interface SkinContextValue {
  skin: Skin;
  skinId: SkinId;
  setSkinId: (id: SkinId) => void;
}

const SkinContext = createContext<SkinContextValue>({
  skin: SKINS.ceramic,
  skinId: 'ceramic',
  setSkinId: () => {},
});

const SKIN_KEY = 'mytap.skin.id';

/** Light haptic on skin change. */
function hapticTick() {
  Haptics.selectionAsync().catch(() => {});
}

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const [skinId, setSkinIdState] = useState<SkinId>('ceramic');

  useEffect(() => {
    AsyncStorage.getItem(SKIN_KEY)
      .then((id) => {
        if (id && id in SKINS) setSkinIdState(id as SkinId);
      })
      .catch(() => {});
  }, []);

  const setSkinId = (id: SkinId) => {
    setSkinIdState(id);
    AsyncStorage.setItem(SKIN_KEY, id).catch(() => {});
    hapticTick();
  };

  const skin = useMemo(() => SKINS[skinId], [skinId]);

  const value = useMemo(() => ({ skin, skinId, setSkinId }), [skin, skinId]);

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}

export function useSkin() {
  return useContext(SkinContext);
}

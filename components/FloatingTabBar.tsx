
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '@/utils/i18n';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default function FloatingTabBar({ 
  tabs, 
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 20 
}: FloatingTabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            animatedValue.value,
            [0, 1],
            [100, 0]
          ),
        },
      ],
      opacity: interpolate(animatedValue.value, [0, 1], [0, 1]),
    };
  });

  React.useEffect(() => {
    animatedValue.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, [animatedValue]);

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const getTabLabel = (originalLabel: string) => {
    const labelMap: { [key: string]: string } = {
      'Map': t('map'),
      'List': t('list'),
      'Favorites': t('favorites'),
      'Profile': t('profile'),
    };
    return labelMap[originalLabel] || originalLabel;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View style={[animatedStyle]}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 100 : 0}
          style={[
            styles.tabBar,
            {
              width: containerWidth,
              borderRadius,
              backgroundColor: Platform.OS === 'ios' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : theme.dark 
                  ? 'rgba(30, 30, 30, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
              borderWidth: Platform.OS === 'ios' ? 0 : 1,
              borderColor: Platform.OS === 'ios' 
                ? 'transparent' 
                : theme.dark 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
            },
          ]}
        >
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.name);
            
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={isActive ? colors.primary : colors.text}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? colors.primary : colors.text,
                    },
                  ]}
                >
                  {getTabLabel(tab.label)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </Animated.View>
    </SafeAreaView>
  );
}

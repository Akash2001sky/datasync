import React, {useEffect, useState} from 'react';
import COLORS from '../../constants/colors';
import {Animated, StyleSheet, Text} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {addEventListener} from '@react-native-community/netinfo';
import {useQuery, useRealm} from '@realm/react';
import Task from '../../databaseLocal/realm';
import {filterTasks} from '../../databaseLocal/database';
const configJSON = require('./config');
const NoInternetConnection = () => {
  const [ribbonHeight, setRibbonHeight] = useState(new Animated.Value(0));
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const tasks = useQuery(Task);
  const realm = useRealm();

  useEffect(() => {
    if (isConnected) {
      filterTasks(tasks, realm);
      setTimeout(() => {
        Animated.timing(ribbonHeight, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 2000);
    } else {
      Animated.timing(ribbonHeight, {
        toValue: !isConnected ? responsiveHeight(12) : responsiveHeight(4),
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  }, [isConnected]);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.animatedView,
        {
          height: ribbonHeight,
          backgroundColor: !isConnected ? COLORS.googleRed : COLORS.googleGreen,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {marginTop: !isConnected ? responsiveHeight(2) : responsiveHeight(0)},
          {
            marginBottom: !isConnected
              ? responsiveHeight(2)
              : responsiveHeight(0),
          },
        ]}>
        {!isConnected ? configJSON.offlineText : configJSON.onlineText}
      </Text>
    </Animated.View>
  );
};

export default NoInternetConnection;

const styles = StyleSheet.create({
  text: {
    color: COLORS.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  animatedView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(100),
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
  },
});

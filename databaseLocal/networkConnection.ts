import NetInfo from '@react-native-community/netinfo';

export const checkNetworkConnectivity = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected || false;
};

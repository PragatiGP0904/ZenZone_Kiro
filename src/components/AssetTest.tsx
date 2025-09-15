import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SafeImage from './SafeImage';
import { ASSETS, AssetKey } from '../constants/assets';

const AssetTest: React.FC = () => {
  const [loadedAssets, setLoadedAssets] = useState<Set<AssetKey>>(new Set());
  const [failedAssets, setFailedAssets] = useState<Set<AssetKey>>(new Set());

  const handleAssetLoad = (assetKey: AssetKey) => {
    setLoadedAssets(prev => new Set([...prev, assetKey]));
    console.log(`✅ Asset loaded: ${assetKey}`);
  };

  const handleAssetError = (assetKey: AssetKey, error: Error) => {
    setFailedAssets(prev => new Set([...prev, assetKey]));
    console.error(`❌ Asset failed: ${assetKey}`, error);
  };

  const requiredAssets: AssetKey[] = ['logo', 'text', 'pentagon', 'group', 'bubble'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Asset Loading Test</Text>
      
      <Text style={styles.subtitle}>Required Assets:</Text>
      {requiredAssets.map((assetKey) => (
        <View key={assetKey} style={styles.assetRow}>
          <Text style={styles.assetName}>{assetKey}:</Text>
          <SafeImage
            assetKey={assetKey}
            style={styles.testImage}
            onLoad={() => handleAssetLoad(assetKey)}
            onError={(error) => handleAssetError(assetKey, error)}
            showFallbackText={true}
          />
          <Text style={[
            styles.status,
            loadedAssets.has(assetKey) ? styles.success : 
            failedAssets.has(assetKey) ? styles.error : styles.loading
          ]}>
            {loadedAssets.has(assetKey) ? '✅ Loaded' : 
             failedAssets.has(assetKey) ? '❌ Failed' : '⏳ Loading'}
          </Text>
        </View>
      ))}

      <Text style={styles.summary}>
        Loaded: {loadedAssets.size} / Failed: {failedAssets.size} / Total: {requiredAssets.length}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  assetName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  testImage: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 80,
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  loading: {
    color: 'orange',
  },
  summary: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});

export default AssetTest;
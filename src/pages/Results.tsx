import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import BackButton from '../components/BackButton';

const Results = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.content}>
        <Text style={styles.title}>Results</Text>

        <Image
          source={{ uri: 'https://example.com/palm-oil-analysis.jpg' }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>NUMBER OF BUNCHES</Text>
            <Text style={styles.statValue}>6</Text>
          </View>

          <View style={styles.ripenessContainer}>
            <Text style={styles.ripenessTitle}>RIPENESS LEVELS</Text>
            <View style={styles.ripenessGrid}>
              <View style={styles.ripenessBox}>
                <Text style={styles.ripenessLabel}>RIPE</Text>
                <Text style={styles.ripenessValue}>3</Text>
              </View>
              <View style={styles.ripenessBox}>
                <Text style={styles.ripenessLabel}>UNDERRIPE</Text>
                <Text style={styles.ripenessValue}>2</Text>
              </View>
              <View style={styles.ripenessBox}>
                <Text style={styles.ripenessLabel}>OVERRIPE</Text>
                <Text style={styles.ripenessValue}>0</Text>
              </View>
              <View style={styles.ripenessBox}>
                <Text style={styles.ripenessLabel}>ABNORMAL</Text>
                <Text style={styles.ripenessValue}>1</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    marginLeft: 48,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 24,
  },
  statsContainer: {
    gap: 24,
  },
  statBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34A853',
  },
  ripenessContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 16,
  },
  ripenessTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  ripenessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  ripenessBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ripenessLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  ripenessValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34A853',
  },
  confirmButton: {
    backgroundColor: '#34A853',
    padding: 16,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Results;
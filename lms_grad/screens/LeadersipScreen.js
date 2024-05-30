import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getLeaderTable } from '../services';


const LeadershipScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    getLeaderTable().then((data) => {
       setLeaderboardData(data.userInfos);
    })
  },[]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 🏆Liderlik Tablosu </Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.email}
        renderItem={({ item, index }) => (
          <View style={[styles.item, index === 0 && styles.leaderItem]}>
            <Text style={styles.rank}>{index === 0 ? "👑" : index + 1}</Text>
            <Text style={styles.email}>{getUsername(item.email)}</Text>
            <Text style={styles.counter}>{item.completedChapterCounter * 10 } puan </Text>   
          </View>
        )}
      />
    </View>
  );
};

const getUsername = (email) => {
  return email.split('@')[0]; 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#89CFF0',
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
  },
  leaderItem: {
    backgroundColor: '#ffeeba',
  },
  rank: {
    fontSize: 24,
    marginRight: 20,
    marginLeft: 10,
  },
  email: {
    flex: 1,
    fontSize: 18,
  },
  counter: {
    fontSize: 22,
    color: 'black',
    paddingHorizontal: 20,
  },
});

export default LeadershipScreen;

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip, Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

const PromotionBanner = () => (
  <Card style={styles.promotionBanner}>
    <Card.Cover
      source={{ uri: 'https://example.com/promotion.jpg' }}
      style={styles.bannerImage}
    />
    <View style={styles.promotionSteps}>
      <Text style={styles.stepText}>Bước 1: Mua combo bắp nước</Text>
      <Text style={styles.stepText}>Bước 2: Quét mã QR để thông tin</Text>
      <Text style={styles.stepText}>Bước 3: Tham gia trúng thưởng</Text>
    </View>
  </Card>
);

const MovieCard = ({ movie, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.movieCard}>
    <Card>
      <Card.Cover source={{ uri: movie.image }} style={styles.movieImage} />
      <Card.Content>
        <Title numberOfLines={2} style={styles.movieTitle}>{movie.title}</Title>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>{movie.rating}</Text>
          </View>
          <Chip mode="outlined" style={styles.ageRating}>{movie.ageRating}</Chip>
        </View>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();

  const movies = [
    {
      id: 1,
      title: 'Bộ Tứ Bảo Thủ',
      image: 'https://example.com/movie1.jpg',
      rating: '9.3',
      ageRating: 'T16'
    },
    {
      id: 2,
      title: 'Đại Chiến Người Khổng Lồ',
      image: 'https://example.com/movie2.jpg',
      rating: '9.7',
      ageRating: 'T16'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <PromotionBanner />
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title>Đang Chiếu</Title>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('MovieList', { type: 'now-showing' })}
          >
            Xem tất cả
          </Button>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPress={() => navigation.navigate('MovieDetail', { movie })}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title>Sắp Chiếu</Title>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('MovieList', { type: 'coming-soon' })}
          >
            Xem tất cả
          </Button>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPress={() => navigation.navigate('MovieDetail', { movie })}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  promotionBanner: {
    margin: 16,
  },
  bannerImage: {
    height: 200,
  },
  promotionSteps: {
    padding: 16,
  },
  stepText: {
    marginVertical: 4,
    fontSize: 14,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  movieCard: {
    width: width * 0.6,
    marginHorizontal: 8,
  },
  movieImage: {
    height: 240,
  },
  movieTitle: {
    fontSize: 16,
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingBox: {
    backgroundColor: '#FFD700',
    padding: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: '#000',
    fontWeight: 'bold',
  },
  ageRating: {
    backgroundColor: '#FFE4E1',
  },
});

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerTitle: 'Galaxy Cinema',
          headerTitleStyle: {
            color: '#e91002',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigation;
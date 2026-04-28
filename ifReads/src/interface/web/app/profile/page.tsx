'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Heart,
  Star,
  Settings,
  MessageSquare,
  Edit3,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StoryCard } from '@/components/story-card';
import { ProfileSettings } from '@/components/profile-settings';
import {
  usersApi,
  type User,
  type FavoriteEntry,
  type ReviewWithFiction,
} from '@/app/api/middleware/users';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('favorites');
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [reviews, setReviews] = useState<ReviewWithFiction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [me, favs, revs] = await Promise.all([
          usersApi.getMe(),
          usersApi.getFavorites(),
          usersApi.getMyReviews(),
        ]);
        setUser(me);
        setFavorites(favs);
        setReviews(revs);
      } catch {
        // not authenticated — could redirect to home
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemoveFavorite = useCallback(async (fictionId: number) => {
    await usersApi.removeFavorite(fictionId);
    setFavorites((prev) => prev.filter((f) => f.fictionId !== fictionId));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          Você precisa estar logado para ver o perfil.
        </p>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const joinedDate = new Date(user.createdAt).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold">ifReads</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/browse">
              <Button variant="ghost" size="sm">
                Browse
              </Button>
            </Link>
            <Avatar className="h-8 w-8 border border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="shrink-0">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl md:text-3xl font-serif">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  {user.name}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Membro desde {joinedDate}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => setActiveTab('settings')}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {reviews.length}
                </p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {favorites.length}
                </p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-card border border-border w-full justify-start overflow-x-auto">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reading History
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              My Reviews
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold">
                Your Favorite Stories
              </h2>
              <p className="text-sm text-muted-foreground">
                {favorites.length} stories
              </p>
            </div>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(({ fiction, fictionId }) => (
                  <div key={fictionId} className="relative group">
                    <StoryCard
                      story={{
                        id: fiction.id.toString(),
                        title: fiction.title,
                        author: {
                          id: fiction.author.id.toString(),
                          name: fiction.author.name,
                        },
                        genre: fiction.genre ?? 'Unknown',
                        description: fiction.description ?? '',
                      }}
                    />
                    <button
                      onClick={() => void handleRemoveFavorite(fictionId)}
                      className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="h-4 w-4 text-primary fill-primary" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Start exploring interactive fiction and save your favorite
                    stories here.
                  </p>
                  <Link href="/browse">
                    <Button>Browse Stories</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold">Your Reviews</h2>
              <p className="text-sm text-muted-foreground">
                {reviews.length} reviews
              </p>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-card/50 border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/story/${review.fiction.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            <h3 className="font-medium text-foreground">
                              {review.fiction.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString(
                                'pt-BR',
                              )}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="mt-3 text-foreground/80">
                              {review.comment}
                            </p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Narrativa: {review.narrative}/5</span>
                            <span>
                              Interatividade: {review.interactivity}/5
                            </span>
                            <span>Originalidade: {review.originality}/5</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/story/${review.fiction.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma review ainda
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Leia e avalie ficções interativas para ver suas reviews
                    aqui.
                  </p>
                  <Link href="/browse">
                    <Button>Browse Stories</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <ProfileSettings
              user={{
                name: user.name,
                username: user.name,
                email: user.email,
                bio: '',
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

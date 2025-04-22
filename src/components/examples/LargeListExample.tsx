
import React, { useState, useCallback } from 'react';
import OptimizedList from '../OptimizedList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from '@/utils/debugUtils';

// Örnek kullanıcı tipi
interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

// Performans testi için örnek veri oluşturma fonksiyonu
const generateMockUsers = (count: number): User[] => {
  const timer = new Timer(`${count} kullanıcı oluşturuluyor`);
  
  const roles = ['Admin', 'Developer', 'Designer', 'Manager', 'Tester'];
  const mockUsers = Array.from({ length: count }).map((_, i) => ({
    id: `user-${i}`,
    name: `Kullanıcı ${i + 1}`,
    role: roles[i % roles.length],
    avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
    // Bazı kullanıcılar için bio ekleyelim (dinamik yükseklik için)
    bio: i % 3 === 0 ? `Bu kullanıcının uzun bir açıklaması var. Bio #${i}` : undefined
  }));
  
  timer.stop();
  return mockUsers;
};

// Kullanıcı kartı bileşeni
const UserCard = ({ user }: { user: User }) => (
  <Card className="mb-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
    <CardContent className="p-2 flex items-center">
      <img 
        src={user.avatar} 
        alt={user.name}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">{user.role}</p>
        {user.bio && <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">{user.bio}</p>}
      </div>
    </CardContent>
  </Card>
);

// Performans optimizasyonu için memo ile sarmalayalım
const MemoizedUserCard = React.memo(UserCard);

// Ana örnek bileşen
const LargeListExample = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [useVariableHeight, setUseVariableHeight] = useState(false);
  
  // Performans testi için farklı boyutlarda veri yükleme
  const loadUsers = useCallback(async (count: number) => {
    setLoading(true);
    
    // Büyük veri setleri için asenkron işlem simüle edelim
    setTimeout(() => {
      const newUsers = generateMockUsers(count);
      setUsers(newUsers);
      setLoading(false);
    }, 500);
  }, []);
  
  // Dinamik yükseklik hesaplama fonksiyonu
  const getItemHeight = useCallback((index: number) => {
    return users[index]?.bio ? 100 : 60;
  }, [users]);
  
  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => loadUsers(100)} size="sm" variant="outline">
          100 Kullanıcı Yükle
        </Button>
        <Button onClick={() => loadUsers(1000)} size="sm" variant="outline">
          1,000 Kullanıcı Yükle
        </Button>
        <Button onClick={() => loadUsers(10000)} size="sm" variant="secondary">
          10,000 Kullanıcı Yükle
        </Button>
        <Button onClick={() => loadUsers(100000)} size="sm" variant="destructive">
          100,000 Kullanıcı (Test)
        </Button>
        <Button onClick={() => setUsers([])} size="sm" variant="outline">
          Temizle
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="variableHeight"
          checked={useVariableHeight}
          onChange={e => setUseVariableHeight(e.target.checked)}
          className="rounded-sm"
        />
        <label htmlFor="variableHeight">Dinamik Yükseklik Kullan</label>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">
          React-Window Optimize Edilmiş Liste ({users.length} kullanıcı)
        </h2>
        
        <OptimizedList<User>
          items={users}
          height={600}
          itemHeight={useVariableHeight ? getItemHeight : 70}
          useVariableHeight={useVariableHeight}
          renderItem={(user) => <MemoizedUserCard user={user} />}
          itemKey={(user) => user.id}
          loading={loading}
          emptyMessage="Lütfen kullanıcıları yüklemek için yukarıdaki butonlardan birine tıklayın"
          overscan={5}
          onScrollEnd={() => console.log("Liste sonuna ulaşıldı")}
        />
      </div>
    </div>
  );
};

export default LargeListExample;

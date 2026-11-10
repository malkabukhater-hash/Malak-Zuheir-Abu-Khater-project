import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  login: (email: string, role: UserRole, name?: string, neighborhood?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  resetToMalak: () => void;
}

export const malakDefaultUser: User = {
  id: 'user-malak-founder',
  name: 'Malak Abu Khater',
  nameAr: 'ملاك أبو خاطر',
  titleAr: 'مؤسس وصاحب منظومة مَدَار',
  titleEn: 'Founder & Brand Owner of MADAR',
  bioAr: 'المؤسس والمشرف العام على منظومة مدار للتكنولوجيا المجتمعية والتكافل الميداني في قطاع غزة.',
  bioEn: 'Founder and architect of the MADAR community technology and mutual-aid ecosystem in Gaza.',
  email: 'malkabukhater@gmail.com',
  role: 'admin',
  neighborhood: 'Deir al-Balah',
  neighborhoodAr: 'دير البلح - الوسطى',
  phone: '+970 59-900-1122',
  isVerified: true,
};

const mockUsers: Record<UserRole, User> = {
  admin: {
    ...malakDefaultUser,
    role: 'admin',
    titleAr: 'مؤسس ومشرف عام المنظومة',
    titleEn: 'Founder & Platform Administrator',
  },
  resident: {
    ...malakDefaultUser,
    role: 'resident',
    titleAr: 'مواطن ومستفيد - حساب المؤسس',
    titleEn: 'Resident & Household Lead (Malak)',
  },
  merchant: {
    id: 'user-merchant-1',
    name: 'Al-Noor Alternative Energy',
    nameAr: 'مؤسسة النور للطاقة واللوازم',
    titleAr: 'تاجر ومورد طاقة بديلة معتمد',
    titleEn: 'Verified Solar & Equipment Supplier',
    email: 'alnoor.solar@madar.ps',
    role: 'merchant',
    neighborhood: 'Khan Younis',
    neighborhoodAr: 'خان يونس - البلد',
    phone: '+970 59-922-3344',
    isVerified: true,
  },
  provider: {
    id: 'user-provider-1',
    name: 'Eng. Ahmad Bardawil',
    nameAr: 'م. أحمد البردويل (فني إنفرترات وطاقة)',
    titleAr: 'مهندس فني صيانة طاقة شمسية',
    titleEn: 'Solar & Power Certified Engineer',
    email: 'ahmad.repair@madar.ps',
    role: 'provider',
    neighborhood: 'Deir al-Balah',
    neighborhoodAr: 'دير البلح',
    phone: '+970 59-933-4455',
    isVerified: true,
  },
  freelancer: {
    id: 'user-freelance-1',
    name: 'Reem Hassouna',
    nameAr: 'ريم حسونة (مترجمة طبية وإنسانية)',
    titleAr: 'أخصائية ترجمة وتقارير إنسانية',
    titleEn: 'Medical & Humanitarian Translator',
    email: 'reem.trans@madar.ps',
    role: 'freelancer',
    neighborhood: 'Nuseirat',
    neighborhoodAr: 'مخيم النصيرات',
    phone: '+970 59-944-5566',
    isVerified: true,
  },
  organization: {
    id: 'user-org-1',
    name: 'Gaza Shelter & Water Relief Coalition',
    nameAr: 'ائتلاف إغاثة الإيواء والمياه - غزة',
    titleAr: 'منظمة إنسانية شريكة',
    titleEn: 'Humanitarian Relief Coalition',
    email: 'relief.coalition@madar.ps',
    role: 'organization',
    neighborhood: 'Gaza City',
    neighborhoodAr: 'مدينة غزة / الوسطى',
    phone: '+970 59-955-6677',
    isVerified: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('madar_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear any old mock placeholders (e.g. Abu Omar) and ensure Malak is default
        if (
          !parsed.name ||
          parsed.name.includes('Abu Omar') ||
          parsed.nameAr?.includes('أبو عمر') ||
          parsed.email?.includes('abuomar')
        ) {
          localStorage.setItem('madar_auth_user', JSON.stringify(malakDefaultUser));
          return malakDefaultUser;
        }
        return parsed;
      }
      return malakDefaultUser;
    } catch {
      return malakDefaultUser;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('madar_auth_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Failed to save user profile to localStorage', e);
    }
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    // If switching role while logged in as Malak, keep Malak's identity but update role
    if (currentUser.email === 'malkabukhater@gmail.com' || currentUser.name.includes('Malak')) {
      setCurrentUser((prev) => ({
        ...prev,
        role,
        titleAr: role === 'admin' ? 'مؤسس ومشرف عام المنظومة' : `حساب المؤسس ملاك (${role})`,
        titleEn: role === 'admin' ? 'Founder & Platform Administrator' : `Founder Profile (${role})`,
      }));
      return;
    }

    const target = mockUsers[role];
    if (target) {
      setCurrentUser(target);
    }
  };

  const login = (email: string, role: UserRole, name?: string, neighborhood?: string) => {
    const user: User = {
      id: 'usr-' + Date.now(),
      name: name || (email.includes('malak') ? 'Malak Abu Khater' : email.split('@')[0]),
      nameAr: name || (email.includes('malak') ? 'ملاك أبو خاطر' : email.split('@')[0]),
      titleAr: role === 'admin' ? 'المؤسس والمشرف العام' : 'عضو مجتمعي مساهم',
      titleEn: role === 'admin' ? 'Founder & Administrator' : 'Community Member',
      email,
      role,
      neighborhood: neighborhood || 'Deir al-Balah',
      neighborhoodAr: neighborhood === 'Khan Younis' ? 'خان يونس' : 'دير البلح',
      isVerified: true,
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(malakDefaultUser);
  };

  const updateProfile = (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('madar_auth_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetToMalak = () => {
    setCurrentUser(malakDefaultUser);
    localStorage.setItem('madar_auth_user', JSON.stringify(malakDefaultUser));
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, login, logout, updateProfile, resetToMalak }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

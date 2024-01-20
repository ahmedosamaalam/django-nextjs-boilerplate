'use client';
import { useLockedBody } from '@/components/hooks/useBodyLock';
import { SidebarContext } from '@/components/layout/layout-context';
import { SidebarWrapper } from '@/components/sidebar/sidebar';
import { ProvideAuth } from '@/utils/context/auth';
import { useProvideAuth } from '@/utils/hooks/auth';
import { redirect, usePathname } from 'next/navigation';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const currentPage = usePathname().split('/').pop();
  const { user } = useProvideAuth();

  const isActive = user?.user?.is_active || false;

  if (!isActive) {
    return redirect('/login');
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <ProvideAuth>
      <SidebarContext.Provider
        value={{
          collapsed: sidebarOpen,
          setCollapsed: handleToggleSidebar,
        }}
      >
        {isActive && (
          <section className="flex">
            <SidebarWrapper />

            <div className="w-8/12 m-auto mt-10">
              <h2 className="capitalize font-bold text-5xl mb-10">
                {currentPage}
              </h2>
              {children}
            </div>
          </section>
        )}
      </SidebarContext.Provider>
    </ProvideAuth>
  );
};

export default DashboardLayout;

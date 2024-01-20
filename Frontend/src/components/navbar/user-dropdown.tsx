import { USERS_ROUTE } from '@/utils/constants/ROUTES';
import { useProvideAuth } from '@/utils/hooks/auth';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
  User,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
// import { DarkModeSwitch } from "./darkmodeswitch";

export const UserDropdown = () => {
  const router = useRouter();
  const { user, signOut } = useProvideAuth();
  const photoImg =
    user?.photoUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d';
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: photoImg,
            }}
            className="transition-transform"
            description="Member since 2021"
            name={user?.username}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={async (actionKey) => {
          if (actionKey === 'logout') {
            await signOut();
            router.push('/login');
          } else if (actionKey === 'settings') {
            // router.push('/settings');
          }
        }}
      >
        <DropdownItem
          isReadOnly
          key="signed_profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p>{user?.username}</p>
        </DropdownItem>
        <DropdownItem key="profile" href={`${USERS_ROUTE}/${user?.id}`}>
          Profile
        </DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger ">
          Log Out
        </DropdownItem>
        {/* <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
};

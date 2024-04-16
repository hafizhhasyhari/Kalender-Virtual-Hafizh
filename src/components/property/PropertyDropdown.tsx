import { ChevronDownIcon } from '@heroicons/react/20/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';

import useGetPropertiesQuery from '@/hooks/useGetPropertiesQuery';

import Button from '../ui/Button';

const PropertyDropdown = () => {
  const router = useRouter();

  const { isLoading, data, error } = useGetPropertiesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  // get name of selected property
  const selectedProperty = data?.find((item) => item.id === router.query.id);

  // check if account page
  const isAccountPage = router.pathname === '/account';

  return (
    <DropdownMenu.Root>
      {isAccountPage && (
        <DropdownMenu.Trigger asChild>
          <Button intent="dark">
            <span className="min-w-0 overflow-hidden truncate">Menu</span>
            <ChevronDownIcon
              className="-mr-0.5 ml-2 h-4 w-4 flex-shrink-0 flex-grow-0 basis-4"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenu.Trigger>
      )}
      {!isAccountPage && (
        <DropdownMenu.Trigger asChild>
          <Button intent="dark">
            <span className="min-w-0 overflow-hidden text-ellipsis">
              {selectedProperty?.name || 'Properties'}
            </span>
            <ChevronDownIcon
              className="-mr-0.5 ml-2 h-4 w-4 flex-shrink-0 flex-grow-0 basis-4"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenu.Trigger>
      )}

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          sideOffset={5}
          align="start"
        >
          <DropdownMenu.Item
            className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onSelect={() => {
              router.push('/properties');
            }}
          >
            Properties
          </DropdownMenu.Item>

          {data && data.length > 0 && (
            <DropdownMenu.Separator className="m-1 h-px bg-gray-200" />
          )}

          {data?.map((item) => {
            const { id, name } = item;

            return (
              <DropdownMenu.Item
                key={id}
                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onSelect={() => {
                  router.push(`/properties/${id}/calendar`);
                }}
              >
                {name}
              </DropdownMenu.Item>
            );
          })}

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default PropertyDropdown;

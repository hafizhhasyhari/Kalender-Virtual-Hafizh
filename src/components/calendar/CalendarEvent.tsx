import classNames from 'classnames';

export default function CalendarEvent({
  title,
  isPast,
  onClick,
  disabled,
}: {
  title: string;
  isPast: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'mb-px w-full rounded-md py-1 ',
        disabled && isPast && 'bg-gray-100 text-gray-300',
        disabled && !isPast && 'bg-gray-100 text-gray-600',
        !disabled && isPast && 'bg-pink-50 text-pink-300 hover:text-pink-400',
        !disabled && !isPast && 'bg-pink-50 text-pink-600 hover:bg-pink-100'
      )}
    >
      <div className="flex items-center">
        <div className={classNames('ml-1 truncate font-semibold ')}>
          {title}
        </div>
      </div>
    </button>
  );
}

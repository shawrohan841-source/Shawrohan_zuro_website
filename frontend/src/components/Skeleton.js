const Skeleton = ({ className = '', variant = 'rectangular', width, height }) => {
  const baseClasses = 'animate-pulse bg-white/5';
  
  const variantClasses = {
    rectangular: '',
    circular: 'rounded-full',
    text: 'rounded',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;

export const ProductCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[3/4] w-full" />
    <Skeleton className="h-4 w-3/4" variant="text" />
    <Skeleton className="h-3 w-1/2" variant="text" />
    <Skeleton className="h-5 w-1/4" variant="text" />
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="bg-[#111111] border border-white/10 p-6 space-y-3">
    <div className="flex justify-between">
      <Skeleton className="h-4 w-1/3" variant="text" />
      <Skeleton className="h-6 w-20" variant="text" />
    </div>
    <Skeleton className="h-3 w-1/4" variant="text" />
    <Skeleton className="h-4 w-1/5" variant="text" />
  </div>
);

export const ReviewSkeleton = () => (
  <div className="bg-[#111111] border border-white/10 p-6 space-y-3">
    <div className="flex items-start gap-3">
      <Skeleton className="w-10 h-10" variant="circular" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" variant="text" />
        <Skeleton className="h-3 w-1/4" variant="text" />
        <Skeleton className="h-3 w-20" variant="text" />
      </div>
    </div>
    <Skeleton className="h-16 w-full" variant="text" />
  </div>
);
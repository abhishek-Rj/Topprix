const SkeletonNav = () => {
  return (
    <header className="fixed w-full z-50 bg-white shadow py-4">
      <div className="container mx-auto px-4 animate-pulse">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-yellow-100 rounded-lg" />
            <div className="h-6 w-24 bg-yellow-100 rounded-md" />
          </div>

          {/* Nav items */}
          <div className="hidden md:flex items-center space-x-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-4 w-20 bg-gray-200 rounded-md"></div>
            ))}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="h-6 w-6 bg-gray-200 rounded-full" />
            <div className="h-6 w-6 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SkeletonNav;

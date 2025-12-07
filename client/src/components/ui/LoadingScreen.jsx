const LoadingScreen = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white chess-bg">
            <div className="text-center">
                {/* Chess Knight Logo */}
                <div className="mb-6">
                    <svg
                        className="w-16 h-16 mx-auto animate-pulse"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 22H5V20H19V22ZM17 10C17 6.13 13.86 3.01 10 3.01C10 3.01 10 3 10 3C9.32 3 8.66 3.1 8.02 3.29L7.21 2.35C8.06 1.82 9 1.45 10 1.27V1C10 0.45 10.45 0 11 0H13C13.55 0 14 0.45 14 1V1.27C17.53 1.94 20.22 4.82 20.86 8.38C21.08 9.56 20.16 10.63 18.96 10.63H17.47C17.17 10.63 16.92 10.44 16.84 10.16C16.73 9.78 16.5 9 16.5 9L13.3 12L11 18H17V10Z"
                            fill="#171717"
                        />
                    </svg>
                </div>

                {/* Loading Spinner */}
                <div className="spinner mx-auto mb-4"></div>

                {/* Text */}
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;

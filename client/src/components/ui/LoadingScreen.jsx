const LoadingScreen = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white chess-bg">
            <div className="text-center">
                {/* Pawn to Glory Logo */}
                <div className="mb-6">
                    <img src="/images/logo.png" alt="Logo" />
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

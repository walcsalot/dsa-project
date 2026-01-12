<?php
// Development mode detection
$isDev = !file_exists(__DIR__ . '/dist/index.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DSA Project</title>
    <?php if ($isDev): ?>
        <!-- Vite HMR Client - Must be loaded first for auto-refresh -->
        <script type="module">
            import('/@vite/client').catch(err => console.error('Vite client error:', err));
        </script>
    <?php endif; ?>
</head>
<body class="min-h-screen overflow-hidden">
    <!-- Split Screen Login Page -->
    <div class="flex flex-col lg:flex-row min-h-screen">
        <!-- Left Side - Maroon Background -->
        <div class="bg-[#800000] w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
            <div class="text-center lg:text-left text-white max-w-md">
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Welcome Back</h1>
                <p class="text-lg sm:text-xl text-white/90 mb-8">Sign in to access your DSA Project account</p>
                <div class="space-y-4">
                    <div class="flex items-center gap-3 text-white/80">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Secure & Reliable</span>
                    </div>
                    <div class="flex items-center gap-3 text-white/80">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        <span>Protected Login</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - White Background with Login Form -->
        <div class="bg-white w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
            <div class="w-full max-w-md">
                <div class="mb-8">
                    <h2 class="text-3xl sm:text-4xl font-bold text-[#800000] mb-2">Login</h2>
                    <p class="text-gray-600">Enter your credentials to continue</p>
                </div>

                <form id="loginForm" class="space-y-6" method="POST" action="">
                    <!-- Username Field -->
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all text-gray-900 placeholder-gray-400"
                            placeholder="Enter your username"
                        />
                    </div>

                    <!-- Password Field -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all text-gray-900 placeholder-gray-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input 
                                id="remember" 
                                name="remember" 
                                type="checkbox" 
                                class="w-4 h-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000] cursor-pointer"
                            />
                            <label for="remember" class="ml-2 text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>
                        <a href="#" class="text-sm text-[#800000] hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <!-- Login Button -->
                    <button 
                        type="submit"
                        class="w-full bg-[#800000] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#700000] focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>

                <!-- Additional Links -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Don't have an account? 
                        <a href="#" class="text-[#800000] font-semibold hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    
    <?php if ($isDev): ?>
        <!-- Load your JavaScript entry point -->
        <script type="module" src="/backend/js/main.js"></script>
    <?php else: ?>
        <!-- Production: Load built assets -->
        <script type="module" src="/dist/backend/js/main.js"></script>
    <?php endif; ?>
</body>
</html>
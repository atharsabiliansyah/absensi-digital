<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Presensi SMK 11 PGRI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            min-height: 100vh;
            background-image: url('{{ asset('images/sekola_pgri.png') }}');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .overlay {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.45);
        }

        /* Default: Tampilan Mobile */
        .mobile-view {
            display: block;
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 400px;
        }
        .desktop-view {
            display: none;
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 440px;
        }

        /* Tampilan Desktop */
        @media (min-width: 768px) {
            body {
                justify-content: flex-end;
                padding-right: 60px;
                padding-left: 0;
            }
            .mobile-view {
                display: none;
            }
            .desktop-view {
                display: block;
            }
        }
    </style>
</head>
<body>

    <! Overlay Dark Background >
    <div class="overlay"></div>

    <! Tampilan Mobile>
    <div class="mobile-view" style="background-color: rgba(15, 23, 42, 0.82); backdrop-filter: blur(10px); border-radius: 28px; padding: 22px 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); color: white;">
        
        <!-- Top Status Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-bottom: 14px; font-weight: 500;">
            <span style="opacity: 0.9;">SMK PGRI 11 CLD</span>
            <span style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 7px; height: 7px; background-color: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px #10b981;"></span> 
                RFID Server Online
            </span>
        </div>

        <!-- Logo & Header Section -->
        <div style="text-align: center; margin-bottom: 16px;">
            <div style="position: relative; width: 90px; height: 90px; margin: 0 auto 8px auto; background: white; border-radius: 50%; padding: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;">
                <img src="{{ asset('images/logo.pgri.png') }}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
                
            </div>
            <h1 style="font-size: 17px; font-weight: bold; color: white; margin: 0 0 2px 0;">SMK PGRI 11 CILEDUG</h1>
            <p style="font-size: 11px; color: rgba(255,255,255,0.8); margin: 0; line-height: 1.3;">Sistem Presensi Digital Berbasis RFID & IoT</p>
        </div>

        <! Login Card >
        <div style="background-color: #ffffff; border-radius: 20px; padding: 22px 18px; color: #1f2937; box-shadow: 0 10px 20px rgba(0,0,0,0.15);">
            <div style="text-align: center; margin-bottom: 16px;">
                <h2 style="font-size: 17px; font-weight: bold; color: #1f2937; margin: 0 0 3px 0;">Masuk Akun</h2>
                <p style="font-size: 11px; color: #6b7280; margin: 0;">Silahkan masuk menggunakan NIP / Akun Guru</p>
            </div>

            <form action="#" method="POST">
                @csrf
                <!-- Username -->
                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px;">Username / NIP</label>
                    <div style="position: relative; display: flex; align-items: center;">
                        <span style="position: absolute; left: 12px; color: #9ca3af; display: flex;">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </span>
                        <input type="text" name="username" required placeholder="Masukkan NIP atau Username" 
                            style="width: 100%; padding: 9px 12px 9px 38px; font-size: 12px; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; outline: none; color: #1f2937;">
                    </div>
                </div>

                <!-- Password -->
                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px;">Password</label>
                    <div style="position: relative; display: flex; align-items: center;">
                        <span style="position: absolute; left: 12px; color: #9ca3af; display: flex;">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </span>
                        <input type="password" name="password" required placeholder="Masukkan password" 
                            style="width: 100%; padding: 9px 36px 9px 38px; font-size: 12px; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; outline: none; color: #1f2937;">
                        <span style="position: absolute; right: 12px; color: #9ca3af; cursor: pointer; display: flex;">
                            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </span>
                    </div>
                </div>

                <!-- Remember & Forgot Password -->
                <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center;">
                        <input type="checkbox" name="remember" id="remember_m" style="width: 14px; height: 14px; margin-right: 6px; accent-color: #2563eb;">
                        <label for="remember_m" style="font-size: 11px; color: #4b5563; cursor: pointer;">Ingat saya</label>
                    </div>
                    <a href="#" style="font-size: 11px; color: #2563eb; text-decoration: none; font-weight: 500;">Lupa Password?</a>
                </div>

                <!-- Submit -->
                <button type="submit" style="width: 100%; padding: 10px; background-color: #2563eb; color: white; font-weight: 600; font-size: 12px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(37,99,235,0.2);">
                    Masuk
                </button>
            </form>

            <!-- Divider -->
            <div style="display: flex; align-items: center; margin: 14px 0;">
                <div style="flex-grow: 1; height: 1px; background-color: #e5e7eb;"></div>
                <span style="padding: 0 8px; font-size: 9px; font-weight: 600; color: #9ca3af; letter-spacing: 0.5px;">ATAU MASUK CEPAT</span>
                <div style="flex-grow: 1; height: 1px; background-color: #e5e7eb;"></div>
            </div>

            <!-- RFID Button -->
            <a href="#" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 10px; background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
                <span style="background: #2563eb; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 9px;">📶</span>
                Masuk dengan Tap Kartu RFID Guru
            </a>
        </div>

        <!-- Footer Mobile (Di dalam Card Hitam) -->
        <div style="text-align: center; margin-top: 14px; padding-top: 4px;">
            <p style="font-size: 10px; color: rgba(255,255,255,0.7); margin: 0;">© 2026 SMK PGRI 11 CILEDUG</p>
            <p style="font-size: 9px; color: rgba(255,255,255,0.5); margin: 2px 0 0 0;">Versi Mobile v2.4.0 • Terkoneksi Reader IoT</p>
        </div>
    </div>


    <! Tampilan Dekstop >
    <div class="desktop-view" style="background-color: #ffffff; border-radius: 24px; padding: 36px 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
        
        <!-- Logo & Header Desktop -->
        <div style="text-align: center; margin-bottom: 24px;">
            <img src="{{ asset('images/logo.pgri.png') }}" alt="Logo SMK PGRI 11" style="height: 120px; width: auto; margin: 0 auto -6px auto; display: block;">
            
            <h1 style="font-size: 22px; font-weight: bold; color: #1f2937; margin: 0 0 4px 0; letter-spacing: -0.5px;">SMK PGRI 11 CILEDUG</h1>
            <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.4;">Sistem Presensi Digital<br><span style="font-weight: 500;">Berbasis RFID dan IoT</span></p>
        </div>

        <!-- Form Login Desktop -->
        <form action="#" method="POST">
            @csrf
            
            <!-- Input Username / NIP -->
            <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Username / NIP</label>
                <div style="position: relative; display: flex; align-items: center;">
                    <span style="position: absolute; left: 14px; color: #9ca3af; display: flex; align-items: center;">
                        <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </span>
                    <input type="text" name="username" required placeholder="Masukkan NIP atau username" 
                        style="width: 100%; padding: 11px 14px 11px 42px; font-size: 13px; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; outline: none; color: #1f2937;">
                </div>
            </div>

            <!-- Input Password -->
            <div style="margin-bottom: 16px;">
    <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Password</label>
    <div style="position: relative; display: flex; align-items: center;">
        <span style="position: absolute; left: 14px; color: #9ca3af; display: flex; align-items: center;">
            <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </span>
        
        <!-- Tambahkan id="password" -->
        <input type="password" id="password" name="password" required placeholder="Masukkan password" 
            style="width: 100%; padding: 11px 40px 11px 42px; font-size: 13px; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; outline: none; color: #1f2937;">
        
        <!-- Tambahkan id="togglePassword" -->
        <span id="togglePassword" style="position: absolute; right: 14px; color: #9ca3af; display: flex; align-items: center; cursor: pointer; transition: color 0.2s;">
            <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        </span>
    </div>
</div>

            <!-- Remember Me -->
            <div style="margin-bottom: 20px; display: flex; align-items: center;">
                <input type="checkbox" name="remember" id="remember_d" style="width: 16px; height: 16px; margin-right: 8px; cursor: pointer; accent-color: #2563eb;">
                <label for="remember_d" style="font-size: 12px; color: #4b5563; cursor: pointer;">Ingat saya</label>
            </div>

            <!-- Tombol Masuk -->
            <button type="submit" style="width: 100%; padding: 12px; background-color: #2563eb; color: white; font-weight: 600; font-size: 13px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                Masuk
            </button>
        </form>

        <!-- Footer Desktop -->
        <div style="text-align: center; margin-top: 20px; padding-top: 14px; border-top: 1px solid #f3f4f6;">
            <p style="font-size: 11px; color: #9ca3af; margin: 0;">© 2026 SMK PGRI 11 CILEDUG</p>
            <p style="font-size: 10px; color: #9ca3af; margin: 2px 0 0 0;">Sistem Presensi Digital</p>
        </div>

    </div>
<script src="{{ asset('js/login.js') }}"></script>
</body>
</html>
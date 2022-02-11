{
    "targets": [
        {
            "target_name": "addon",
            "sources": ["./src/addon/addon.cc"],
            "cflags": ["-fexceptions"],
            "cflags_cc": ["-fexceptions"],
            "include_dirs":["C:/Users/Modail/Desktop/Graduation_Project/GM_SafeFileSplit/sources/openssl_lib_new/include",
                            "C:/Users/Modail/Desktop/Graduation_Project/GM_SafeFileSplit/sources/cryptoPP_lib/includes"],
            "libraries":["C:/Users/Modail/Desktop/Graduation_Project/GM_SafeFileSplit/sources/cryptoPP_lib/lib/cryptlib.lib",
                         "C:/Users/Modail/Desktop/Graduation_Project/GM_SafeFileSplit/sources/openssl_lib_new/lib/libssl64MT.lib",
                         "C:/Users/Modail/Desktop/Graduation_Project/GM_SafeFileSplit/sources/openssl_lib_new/lib/libcrypto64MT.lib",
                         ]
        }
    ]
}

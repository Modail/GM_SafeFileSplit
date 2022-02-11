#include <node.h>
#include <fstream>
#include <iostream>
#include <windows.h>
#include <string>
#include <osrng.h>
#include <files.h>
#include <ida.h>
#include <channels.h>
#include <smartptr.h>
#include <openssl/ec.h>
#include <openssl/evp.h>
#include <openssl/bio.h>
#include <openssl/pem.h>
#pragma comment(lib, "ws2_32.lib")
#pragma comment(lib, "Crypt32.lib")
namespace demo_one
{

    using CryptoPP::AutoSeededRandomPool;
    using CryptoPP::ChannelSwitch;
    using CryptoPP::DEFAULT_CHANNEL;
    using CryptoPP::FileSink;
    using CryptoPP::FileSource;
    using CryptoPP::SecByteBlock;
    using CryptoPP::SecretRecovery;
    using CryptoPP::SecretSharing;
    using CryptoPP::vector_member_ptrs;
    using CryptoPP::word32;
    using CryptoPP::WordToString;
    using std::cout;
    using std::fstream;
    using std::ios_base;
    using std::string;
    using std::vector;
    using v8::Array;
    using v8::Context;
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::MaybeLocal;
    using v8::Number;
    using v8::Object;
    using v8::String;
    using v8::Value;

    //参数：threshold 陷门数  nshares 分割数 filename 分割文件名
    void SecretShareFile(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();
        Local<Context> context = isolate->GetCurrentContext();
        Local<Number> threshold = Local<Number>::Cast(args[0]);
        Local<Number> nshares = Local<Number>::Cast(args[1]);
        Local<String> file = Local<String>::Cast(args[2]);
        int t = threshold->IntegerValue(context).ToChecked();
        int n = nshares->IntegerValue(context).ToChecked();
        String::Utf8Value f(isolate, file);
        string filename(*f);
        AutoSeededRandomPool rng;
        ChannelSwitch *channelSwitch = new ChannelSwitch;
        FileSource source(filename.c_str(), false, new SecretSharing(rng, t, n, channelSwitch));
        vector_member_ptrs<FileSink> fileSinks(n);
        string channel;
        for (int i = 0; i < n; i++)
        {
            char extension[5] = ".000";
            extension[1] = '0' + byte(i / 100);
            extension[2] = '0' + byte((i / 10) % 10);
            extension[3] = '0' + byte(i % 10);
            fileSinks[i].reset(new FileSink((filename + extension).c_str()));
            channel = WordToString<word32>(i);
            fileSinks[i]->Put((const byte *)channel.data(), 4);
            channelSwitch->AddRoute(channel, *fileSinks[i], DEFAULT_CHANNEL);
        }
        source.PumpAll();
    }

    //参数:threshold:陷门数  outFilename :恢复文件名 inFile_names：门限秘钥文件名
    void SecretRecoverFile(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();
        Local<Context> context = isolate->GetCurrentContext();
        Local<Number> threshold = Local<Number>::Cast(args[0]);
        Local<String> outFilename = Local<String>::Cast(args[1]);
        Local<Array> inFile_names = Local<Array>::Cast(args[2]);
        int t = threshold->NumberValue(context).ToChecked();
        String::Utf8Value f(isolate, outFilename);
        string outFileName(*f);
        //从js传来的数组获得数据
        vector<string> inFileNames;
        for (int i = 0; i < t; ++i)
        {
            Local<Value> cur = inFile_names->Get(context, i).ToLocalChecked()->ToString(context).ToLocalChecked();
            String::Utf8Value c(isolate, cur);
            string inFilename(*c);
            inFileNames.push_back(inFilename);
        }
        SecretRecovery recovery(t, new FileSink(outFileName.c_str()));
        vector_member_ptrs<FileSource> fileSources(t);
        SecByteBlock channel(4);
        for (int i = 0; i < t; i++)
        {
            fileSources[i].reset(new FileSource(inFileNames[i].c_str(), false));
            fileSources[i]->Pump(4);
            fileSources[i]->Get(channel, 4);
            fileSources[i]->Attach(new ChannelSwitch(recovery, string((char *)channel.begin(), 4)));
        }
        while (fileSources[0]->Pump(256))
            for (int i = 1; i < t; ++i)
                fileSources[i]->Pump(256);
        for (int i = 0; i < t; ++i)
            fileSources[i]->PumpAll();
    }

    void Encrypt_KEYMGMT_SM2(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();
        Local<Context> context = isolate->GetCurrentContext();
        Local<String> file = Local<String>::Cast(args[0]);
        String::Utf8Value f(isolate, file);
        string filename(*f);
        //获取文件里的数据并转换成数组类型
        fstream initFile(filename.c_str(), ios_base::in | ios_base::binary);
        initFile.seekg(0, ios_base::end);
        size_t fileLength = initFile.tellg();
        initFile.seekg(0, ios_base::beg);
        char *in_buffer = new char[fileLength];
        for (int i = 0; i < fileLength; ++i)
        {
            initFile.get(in_buffer[i]);
        }
        initFile.close();

        //打开源文件，待写入加密后的数据
        fstream encryptedFile(filename.c_str(), ios_base::out | ios_base::binary);
        if (!encryptedFile.is_open())
        {
            cout << "file is not open \n";
        }
        //生成SM2密钥对
        EVP_PKEY *pkey = NULL;

        //初始化CTX
        EVP_PKEY_CTX *pctx = NULL, *ectx = NULL;

        unsigned char *ciphertext = NULL;
        size_t ciphertext_len;
        char *priv_key = NULL;
        char *pub_key = NULL;
        size_t pub_len;
        size_t priv_len;
        BIO *pri = BIO_new(BIO_s_mem());
        BIO *pub = BIO_new(BIO_s_mem());

        /* create SM2 Ellipse Curve parameters and key pair */
        if (!(pctx = EVP_PKEY_CTX_new_id(EVP_PKEY_EC, NULL)))
        {
            goto clean_up;
        }

        if ((EVP_PKEY_paramgen_init(pctx)) != 1)
        {
            goto clean_up;
        }

        if ((EVP_PKEY_CTX_set_ec_paramgen_curve_nid(pctx, NID_sm2)) <= 0)
        {
            goto clean_up;
        }

        if ((EVP_PKEY_keygen_init(pctx)) != 1)
        {
            goto clean_up;
        }

        if ((EVP_PKEY_keygen(pctx, &pkey)) != 1)
        {
            goto clean_up;
        }

        //读取私钥，公钥信息,存入字符数组
        PEM_write_bio_PrivateKey(pri, pkey, NULL, NULL, 0, NULL, NULL);
        PEM_write_bio_PUBKEY(pub, pkey);
        priv_len = BIO_pending(pri);
        pub_len = BIO_pending(pub);

        priv_key = new char[priv_len + 1];
        pub_key = new char[pub_len + 1];

        BIO_read(pri, priv_key, priv_len);
        BIO_read(pub, pub_key, pub_len);

        priv_key[priv_len] = '\0';
        pub_key[pub_len] = '\0';

        /* compute SM2 encryption */
        if (EVP_PKEY_set_alias_type(pkey, EVP_PKEY_SM2) != 1)
        {
            goto clean_up;
        }

        if (!(ectx = EVP_PKEY_CTX_new(pkey, NULL)))
        {
            goto clean_up;
        }

        if ((EVP_PKEY_encrypt_init(ectx)) != 1)
        {
            goto clean_up;
        }

        if ((EVP_PKEY_encrypt(ectx, NULL, &ciphertext_len, (unsigned char *)in_buffer, fileLength)) != 1)
        {
            goto clean_up;
        }

        if (!(ciphertext = (unsigned char *)malloc(ciphertext_len)))
        {
            goto clean_up;
        }

        if ((EVP_PKEY_encrypt(ectx, ciphertext, &ciphertext_len, (unsigned char *)in_buffer, fileLength)) != 1)
        {
            goto clean_up;
        }
        //将密文存入原来文件中
        for (int i = 0; i < ciphertext_len; i++)
        {
            encryptedFile.put(ciphertext[i]);
        }
        encryptedFile.close();

    clean_up:
        if (pctx)
        {
            EVP_PKEY_CTX_free(pctx);
        }

        if (pkey)
        {
            EVP_PKEY_free(pkey);
        }

        if (ectx)
        {
            EVP_PKEY_CTX_free(ectx);
        }

        if (ciphertext)
        {
            free(ciphertext);
        }
        if (pub)
        {
            BIO_free_all(pub);
        }
        if (pri)
        {
            BIO_free_all(pri);
        }
        //返回密钥对，目的是传递这次加密的私钥，使得解密成功
        Local<Object> pkey_pair = Object::New(isolate);
        Local<Value> pkey_pair_pub_value = String::NewFromUtf8(isolate, pub_key).ToLocalChecked();
        Local<Value> pkey_pair_priv_value = String::NewFromUtf8(isolate, priv_key).ToLocalChecked();
        pkey_pair->Set(context, String::NewFromUtf8(isolate, "pub_key_str").ToLocalChecked(), pkey_pair_pub_value);
        pkey_pair->Set(context, String::NewFromUtf8(isolate, "priv_key_str").ToLocalChecked(), pkey_pair_priv_value);
        args.GetReturnValue().Set(pkey_pair);
        delete[] priv_key;
        delete[] pub_key;
    }
    void Decrypt_KEYMGMT_SM2(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();
        Local<String> file = Local<String>::Cast(args[0]);
        Local<String> priv_key = Local<String>::Cast(args[1]);
        String::Utf8Value f(isolate, file);
        String::Utf8Value k(isolate, priv_key);
        string filename(*f);
        string priv_key_val(*k);

        //打开待解密文件，读取密文数据
        fstream recovery_file(filename.c_str(), ios_base::in | ios_base::binary);
        recovery_file.seekg(0, ios_base::end);
        size_t ciphertext_len = recovery_file.tellg();
        recovery_file.seekg(0, ios_base::beg);
        char *ciphertext = new char[ciphertext_len];
        for (int i = 0; i < (int)ciphertext_len; ++i)
        {
            recovery_file.get(ciphertext[i]);
        }
        recovery_file.close();
        //打开待解密文件,待写入解密后的数据
        fstream decrypted_file(filename.c_str(), ios_base::out | ios_base::binary);

        //定义sm2密钥结构，并初始化
        EVP_PKEY *pkey = NULL;
        BIO *keybio = NULL;
        keybio = BIO_new_mem_buf(priv_key_val.c_str(), -1);

        //初始化CTX
        EVP_PKEY_CTX *ectx = NULL;

        unsigned char *plaintext = NULL;
        size_t plaintext_len;

        //初始化私钥
        if (!(pkey = PEM_read_bio_PrivateKey(keybio, NULL, NULL, NULL)))
        {
            goto clean_up;
        }

        // 初始化SM2 ectx
        if ((EVP_PKEY_set_alias_type(pkey, EVP_PKEY_SM2)) != 1)
        {
            goto clean_up;
        }

        if (!(ectx = EVP_PKEY_CTX_new(pkey, NULL)))
        {
            goto clean_up;
        }

        /* compute SM2 decryption */
        if ((EVP_PKEY_decrypt_init(ectx)) != 1)
        {
            goto clean_up;
        }

        if ((EVP_PKEY_decrypt(ectx, NULL, &plaintext_len, (unsigned char *)ciphertext, ciphertext_len)) != 1)
        {
            goto clean_up;
        }

        if (!(plaintext = (unsigned char *)malloc(plaintext_len)))
        {
            goto clean_up;
        }

        if ((EVP_PKEY_decrypt(ectx, plaintext, &plaintext_len, (unsigned char *)ciphertext, ciphertext_len)) != 1)
        {
            goto clean_up;
        }
        for (int i = 0; i < (int)plaintext_len; ++i)
        {

            decrypted_file.put(plaintext[i]);
        }
        decrypted_file.close();

    clean_up:
        if (pkey)
        {
            EVP_PKEY_free(pkey);
        }

        if (ectx)
        {
            EVP_PKEY_CTX_free(ectx);
        }

        if (ciphertext)
        {
            free(ciphertext);
        }

        if (plaintext)
        {
            free(plaintext);
        }
        if (keybio)
        {
            BIO_free(keybio);
        }
    }

    void Init(Local<Object> exports)
    {
        NODE_SET_METHOD(exports, "SecretShareFile", SecretShareFile);
        NODE_SET_METHOD(exports, "SecretRecoverFile", SecretRecoverFile);
        NODE_SET_METHOD(exports, "Encrypt_KEYMGMT_SM2", Encrypt_KEYMGMT_SM2);
        NODE_SET_METHOD(exports, "Decrypt_KEYMGMT_SM2", Decrypt_KEYMGMT_SM2);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

} // namespace demo
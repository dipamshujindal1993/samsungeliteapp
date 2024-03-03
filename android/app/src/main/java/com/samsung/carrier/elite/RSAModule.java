package com.samsung.carrier.elite;

import android.text.TextUtils;
import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.RSAPublicKeySpec;

import javax.crypto.Cipher;

public class RSAModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RSAModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RSA";
    }

    @ReactMethod
    public void encrypt(String encryptionKey, String text, Promise promise) {
        try {
            if (TextUtils.isEmpty(encryptionKey)) {
                promise.reject("encryptionKey", "Please provide encryption key!");
            }

            String[] parts = encryptionKey.split("\\.", 0);
            if (parts.length != 2) {
                promise.reject("encryptionKey", "Please provide valid encryption key!");
            }

            byte[] rawModulus = Base64.decode(parts[0], Base64.DEFAULT);
            byte[] rawExponent = Base64.decode(parts[1], Base64.DEFAULT);

            // Create the RSAEncryption object
            BigInteger modulus = new BigInteger(1, rawModulus);
            BigInteger exponent = new BigInteger(1, rawExponent);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            RSAPublicKeySpec pubKeySpec = new RSAPublicKeySpec(modulus, exponent);
            RSAPublicKey key = (RSAPublicKey) keyFactory.generatePublic(pubKeySpec);

            // Create cipher
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] cipherData = cipher.doFinal(text.getBytes());

            WritableMap map = Arguments.createMap();
            map.putString("encrypted", Base64.encodeToString(cipherData, Base64.DEFAULT));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("RSA.encrypt", e);
        }
    }
}

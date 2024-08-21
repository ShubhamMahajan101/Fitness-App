package com.nrth;

import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class VoiceChangingModule extends ReactContextBaseJavaModule {

    VoiceChangingModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "VoiceChangingModule";
    }


//   @RequiresApi(api = Build.VERSION_CODES.M)
//     @ReactMethod
//     public void changeVoiceToAlien(String file) {
//      Uri  uri = getIntent().getData();
//         if (uri != null) {
//             Log.e("uri===>",uri.toString());
//     }






  @ReactMethod
    public void changeVoiceToAlien(Promise promise) {
        try {
            // Retrieve or produce the data you want to send to JavaScript
             String data = "Hello from Native Module!";
            Uri uri =  getCurrentActivity().getIntent().getData();
           if (uri != null) {
                 Log.e("uri===>",uri.toString());
              }

            Log.e("uri===>",data);

            // Resolve the promise with the data
            promise.resolve(uri);
        } catch (Exception e) {
            // Reject the promise with an error message
            promise.reject("ERROR_CODE", "An error occurred while getting data from native module.");
        }
    }
}
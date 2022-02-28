package com.iesfranciscodelosrios.expressprint;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        //Aqui los plugin no oficiales
        //registerPlugin(StoragePlugin.class);
        registerPlugin(GoogleAuth.class);
    }
}

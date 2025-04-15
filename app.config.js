import 'dotenv/config';

export default {
    expo: {
        name: "newlightlastone",
        slug: "newlightlastone",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "newlightlastone",
        deepLinks: ["NewLightLastONE://login"],
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            package: process.env.ANDROID_PACKAGE_NAME,
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",

            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            facebookAppId: process.env.FACEBOOK_APP_ID,
            facebookDisplayName: process.env.FACEBOOK_DISPLAY_NAME,
            facebookScheme: process.env.FACEBOOK_SCHEME,
            easProjectId: process.env.EAS_PROJECT_ID,
        },
        owner: "ahmadamous",
    },
};

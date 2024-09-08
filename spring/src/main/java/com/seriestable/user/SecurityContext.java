package com.seriestable.user;


public final class SecurityContext {

    private static final ThreadLocal<String> currentUser = new ThreadLocal<String>();

    public static String getCurrentUser() {
        String user = currentUser.get();
        if (user == null) {
            throw new IllegalStateException("No user is currently signed in");
        }
        return user;
    }

    public static void setCurrentUser(String user) {
        currentUser.set(user);
    }

    public static boolean userSignedIn() {
        return currentUser.get() != null;
    }

    public static void remove() {
        currentUser.remove();
    }

}
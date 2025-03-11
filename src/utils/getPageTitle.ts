export function getPageTitle(pathname: string): string {
    switch (pathname) {
      case "/":
        return "Home";
      case "/login":
        return "login";
      case "/results":
        return "Resultater";
      case "/eksamen1":
        return "Eksamen 1";
      case "/eksamen2":
        return "Eksamen 2";
      case "/eksamen3":
        return "Eksamen 3";
      case "/eksamen4":
        return "Eksamen 4";
      case "/profile":
        return "Min Profil";
      default:
        return "ExPhil App";
    }
  }
  
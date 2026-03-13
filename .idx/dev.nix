{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_22
    pkgs.git
  ];

  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];

    previews = {
      enable = true;
      previews = {
        web = {
          command = [
            "sh"
            "-c"
            "npm run dev -- --hostname 0.0.0.0 --port ${PORT:-3000}"
          ];
          manager = "web";
        };
      };
    };

    workspace = {
      onCreate = {
        install = "npm ci";
      };

      onStart = {
        typecheck = "npx tsc --noEmit";
      };
    };
  };
}

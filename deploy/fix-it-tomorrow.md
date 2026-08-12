# Fix it tomorrow

Add this to `/etc/nginx/sites-available/server.voss.industries` inside the `server_name varis.voss.industries;` TLS block:

```nginx
location = /tc/embedded-generator {
    return 301 /tc/embedded-generator/;
}

location ^~ /tc/embedded-generator/ {
    proxy_pass http://127.0.0.1:8024/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_redirect off;
}
```

Then run:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Verify:
- `https://varis.voss.industries/tc/embedded-generator/` returns 200
- `https://server.voss.industries/varis/tc/embedded-generator/` is only the temporary cursed route
- `systemctl --user status embedded-tutor-canvas-generator.service` stays active

# GlowCare production deployment

1. Copy `backend/.env.example` to `backend/.env` and set a production MongoDB
   URL, a long unique `SECRET_KEY`, the public `CORS_ORIGINS`, and SMTP values.
   Do not commit this file.
2. Configure a TLS reverse proxy/load balancer in front of the frontend and
   expose HTTPS. Set `FRONTEND_URL` and `BACKEND_URL` to the public addresses.
3. For online consultations, users and doctors open a private WhatsApp chat
   from an accepted appointment, then use WhatsApp’s own call controls.
4. Run `docker compose -f docker-compose.production.yml up -d --build`.
5. Verify `https://your-domain/api/health` returns `{"status":"ok"}` and test
   a patient/doctor online appointment with valid WhatsApp phone numbers.

The browser build is served by Nginx and proxies `/api` to FastAPI. MongoDB is
intentionally external to this compose file so database backups, access control,
and availability can be managed by the selected production database provider.

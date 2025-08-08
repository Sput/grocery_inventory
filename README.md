# Shopping Codex Next.js Application

This project is a port of the original Streamlit Shopping Codex app to Next.js, using Supabase for authentication and data storage. This app enables management of your groceries. Rather than create a list from scratch, this app works backwards. You create an inventory, then a list is created based on items not in your inventory.

## Setup
1. Copy `.env.local.example` to `.env.local`; the `NEXT_PUBLIC_SUPABASE_URL` is preset, then fill in your keys:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

## Pages
- `/login`: Sign in with email/password
- `/impromptu`: Impromptu list page (Supabase table `impromptu_list`)
- `/after-costco`: Shopping list page with options to mark items for Harris Teeter (Supabase table `costco`)
- `/manage-inventory`: Add new items to inventory (Supabase tables `location`, `items`)
- `/costco`: List all Costco items (Supabase table `costco`)
- `/harris-teeter`: List all Harris Teeter items (Supabase table `harris_teeter`)
- `/meals`: Mark and view meals (Supabase table `meals`)
- `/inventory`: Shopping list across locations and impromptu (Supabase tables `items`, `impromptu_list`)
- `/change-password`: Change your Supabase authentication password
- More pages to be ported: After Costco, Manage Inventory, Costco, Harris Teeter, Meals, Inventory

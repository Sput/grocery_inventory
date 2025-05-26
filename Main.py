import streamlit as st
import csv
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import streamlit_authenticator as stauth

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)

# Hardcoded users (no emails)
credentials = {
    "usernames": {
        "ben": {
            "name": "Ben",
            "password": "$2b$12$/ewMTWk6dIuWbkZBCfOxYONiU9vXpkqRk3XGeOB/Hciz6RaveRBtC"
        },
        "hannah": {
            "name": "Hannah",
            "password": "$2b$12$yqT47MofI.paczaYZwa6Vu5pv5ZbHlTzXe5FhLmgfYcjHx19fuN/G"
        },
        "paul": {
            "name": "Paul",
            "password": "$2b$12$pxQGRPfv4D1TgCocO0r/6uxtxUS6yE1bIkYMW285Xz6.05ZeazHua"
        },
        "jennifer": {
            "name": "Jennifer",
            "password": "$2b$12$a.tmO9Zxtw5kjafBHekBZ.bqWwPtEjLhVJtbMpd.LAjM7hp.WTGzm"
        }
    }
}

authenticator = stauth.Authenticate(
    credentials,
    "my_cookie", "my_signature_key",
    cookie_expiry_days=30
)

name, auth_status, username = authenticator.login(fields={"Form name": "Login"})

if auth_status:
    st.session_state["authentication_status"] = True
    st.session_state["name"] = name
    st.session_state["username"] = username
    authenticator.logout("Logout", "sidebar")
    st.sidebar.success(f"Welcome {name}!")
    st.write("You are logged in.")
elif auth_status is False:
    st.error("Username or password is incorrect.")
elif auth_status is None:
    st.warning("Please enter your credentials.")


# st.title('Shopping List')

# # import items.csv and save items grouped by location
# items_by_location = {}
# response = supabase.table('items').select('name, location').execute()
# for row in response.data:
#     item, location = row['name'].strip(), row['location'].strip()
#     if location not in items_by_location:
#         items_by_location[location] = []
#     items_by_location[location].append(item)

# costco_items = []
# harris_teeter_items = []

# # Create radio buttons for each location group
# for location, items in items_by_location.items():
#     st.subheader(location)  # Display the location as a subheader
#     for index, item in enumerate(items):
#         status = st.radio(item, ['Have', 'Costco', 'Harris Teeter'], key=f'status_{location}_{index}', horizontal=True)
#         if status == 'Costco':
#             costco_items.append(item)
#         elif status == 'Harris Teeter':
#             harris_teeter_items.append(item)

# # Load contents of impromptu_list from Supabase
# impromptu_items = []
# response = supabase.table('impromptu_list').select('name').execute()
# impromptu_items = [row['name'].strip() for row in response.data]  # Read and strip items

# # Display impromptu items with radio buttons
# if impromptu_items:
#     st.subheader("Impromptu List")
#     for index, item in enumerate(impromptu_items):
#         status = st.radio(item, ['Have', 'Costco', 'Harris Teeter'], key=f'impromptu_status_{index}', horizontal=True)
#         if status == 'Costco':
#             costco_items.append(item)
#         elif status == 'Harris Teeter':
#             harris_teeter_items.append(item)
# else:
#     st.write("The impromptu list is empty.")    


# # Add a button to save changes
# if st.button('Save Changes'):
#     # Save Costco items to Supabase
#     for item in costco_items:
#         supabase.table('costco').insert({'items': item}).execute()

#     # Save Harris Teeter items to Supabase
#     for item in harris_teeter_items:
#         supabase.table('harris_teeter').insert({'items': item}).execute()

#     # Save impromptu items based on their status
#     for index, item in enumerate(impromptu_items):
#         status = st.session_state.get(f'impromptu_status_{index}', 'Have')  # Get the status from session state
#         if status == 'Costco':
#             supabase.table('costco').insert({'items': item}).execute()
#         elif status == 'Harris Teeter':
#             supabase.table('harris_teeter').insert({'items': item}).execute()
    
#     st.success('Changes saved successfully!')



# # Existing code...
import streamlit as st
import csv
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Check for authentication status
if st.session_state.get("authentication_status") != True:
    st.error("⛔ You must log in to access this page.")
    st.stop()


load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)

st.title('Harris Teeter List')

# Fetch all items from the 'harris_teeter' table
response = supabase.table('harris_teeter').select('items').is_('is_deleted', None).execute()
# Display the items
if response.data:
    for item in response.data:
        st.write(item['items'])  # Display each item
else:
    st.write("No items found in the Harris Teeter table.")
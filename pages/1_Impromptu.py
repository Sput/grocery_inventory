import streamlit as st
import csv
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)

# Check for authentication status
if st.session_state.get("authentication_status") != True:
    st.error("⛔ You must log in to access this page.")
    st.stop()

# Display current contents of the CSV file on page load
try:
    response = supabase.table('impromptu_list').select('name').is_('is_deleted', None).execute()
    contents = [row['name'].strip() for row in response.data]  # Read and strip names
    if contents:
        st.write("Current List:")
        for item in contents:
            st.write(item)  # Display each item
    else:
        st.write("The list is empty.")
except Exception as e:
    st.write(f"An error occurred: {e}")
# Existing code...

# Add a text box for user input
user_input = st.text_input("Enter your text here:")

# Add a button that performs an action when clicked
if st.button("Submit"):
    # Write user input to Supabase
    supabase.table('impromptu_list').insert({'name': user_input}).execute()
    st.write(f"Added to list: {user_input}")

   # Add a button to mark all items as deleted in the impromptu_list in Supabase
if st.button("Clear List"):
    # Execute the stored procedure to mark all records as deleted
    supabase.rpc('mark_all_deleted').execute()
    supabase.rpc('clear_all_costco').execute()
    supabase.rpc('clear_all_harris_teeter').execute()
    st.write("All items marked as deleted.")

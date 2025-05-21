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


st.title('Shopping List')
# Fetch all items from the 'costco' table
response = supabase.table('costco').select('items').is_('is_deleted', None).execute()


harris_teeter_items = []

# for index, item in enumerate(items):
#     status = st.radio(item, ['Have', 'Harris Teeter'], key=f'status_{index}', horizontal=True)
#     if status == 'Harris Teeter':
#         harris_teeter_items.append(item)

# # # print the list to the screen
# # for item in items:
# #     st.write(item)

# # for index, item in enumerate(items):
# #     col1, col2, col3, col4 = st.columns(4)
# #     with col1:
# #         st.write(item)
# #     # with col2:
# #     #     st.radio("", ["Need to buy"], key=f'buy_{index}', horizontal=True)
# #     # with col3:
# #     #     st.radio("", ["Already bought"], key=f'bought_{index}', horizontal=True)
# #     # with col4:
# #     #     st.radio("", ["Not needed"], key=f'not_needed_{index}', horizontal=True)
# #     with col2:
# #         choice = st.radio("", ["Need to buy", "Already bought", "Not needed"], key=f'status_{index}')

# # Add a button to save changes
# if st.button('Save Changes'):
#     with open('harris_teeter.csv', 'a', newline='') as file:
#         writer = csv.writer(file)
#         for item in harris_teeter_items:
#             writer.writerow([item])
    
#     st.success('Changes saved successfully!')


harris_teeter_items = []

# ✅ Use the returned items from Supabase
if response.data:
    items = [row['items'] for row in response.data]

    for index, item in enumerate(items):
        status = st.radio(item, ['Have', 'Harris Teeter'], key=f'status_{index}', horizontal=True)
        if status == 'Harris Teeter':
            harris_teeter_items.append(item)

# ✅ Save to Supabase instead of CSV
if st.button('Save Changes'):
    for item in harris_teeter_items:
        supabase.table('harris_teeter').insert({"items": item}).execute()

    st.success('Changes saved successfully!')
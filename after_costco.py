import streamlit as st
import csv

st.title('Shopping List')

# import items.csv and save the first column as a list
items = open('costco.csv').readlines()
items = [item.strip() for item in items]


harris_teeter_items = []

for index, item in enumerate(items):
    status = st.radio(item, ['Have', 'Harris Teeter'], key=f'status_{index}', horizontal=True)
    if status == 'Harris Teeter':
        harris_teeter_items.append(item)

# # print the list to the screen
# for item in items:
#     st.write(item)

# for index, item in enumerate(items):
#     col1, col2, col3, col4 = st.columns(4)
#     with col1:
#         st.write(item)
#     # with col2:
#     #     st.radio("", ["Need to buy"], key=f'buy_{index}', horizontal=True)
#     # with col3:
#     #     st.radio("", ["Already bought"], key=f'bought_{index}', horizontal=True)
#     # with col4:
#     #     st.radio("", ["Not needed"], key=f'not_needed_{index}', horizontal=True)
#     with col2:
#         choice = st.radio("", ["Need to buy", "Already bought", "Not needed"], key=f'status_{index}')

# Add a button to save changes
if st.button('Save Changes'):
    with open('harris_teeter.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        for item in harris_teeter_items:
            writer.writerow([item])
    
    st.success('Changes saved successfully!')
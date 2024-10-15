// src/services/applyRoom.js

import { supabase } from '../Supabase';

/**
 * Applies the current user to a specified room in a hostel.
 *
 * @param {Object} params - The parameters for applying to a room.
 * @param {string} params.hostelId - The ID of the hostel.
 * @param {string} params.roomId - The ID of the room.
 *
 * @returns {Promise<Object>} - An object containing the success status and message.
 */
export const applyToRoom = async ({ hostelId, roomId }) => {
  try {
    // 1. Get the current authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('Step 1: Get User', { userData, userError });
    if (userError || !userData.user) {
      return { success: false, message: 'You must be logged in to apply.' };
    }

    const userid = userData.user.id;

    // 2. Check if the user is already assigned to a room
    const { data: existingOccupant, error: occupantError } = await supabase
      .from('occupantdetails')
      .select('*')
      .eq('userid', userid)
      .single();

    console.log('Step 2: Check Existing Occupant', { existingOccupant, occupantError });

    if (occupantError && occupantError.code !== 'PGRST116') { // PGRST116: No rows found
      throw occupantError;
    }

    if (existingOccupant) {
      return { success: false, message: 'You are already assigned to a hostel.' };
    }

    // 3. Check if the room has any vacancies
    const { data: roomData, error: roomError } = await supabase
      .from('hostelroomdetails')
      .select('*')
      .eq('roomid', roomId)
      .eq('hostelid', hostelId) // Ensure hostelId is part of the condition
      .single();

    console.log('Step 3: Check Room Vacancies', { roomData, roomError });

    if (roomError) {
      throw roomError;
    }

    if (roomData.vacancies <= 0) {
      return { success: false, message: 'No vacancies available in this room.' };
    }

    // 4. Fetch user's gender from the users table
    const { data: userGenderData, error: userGenderError } = await supabase
      .from('users')
      .select('gender')
      .eq('id', userid)
      .single();

    console.log('Step 4: Fetch User Gender', { userGenderData, userGenderError });

    if (userGenderError) {
      if (userGenderError.code === 'PGRST116') {
        return { success: false, message: 'User profile not found. Please complete your profile.' };
      }
      throw userGenderError;
    }

    const userGender = userGenderData.gender;

    // 5. Fetch hostel's gender
    const { data: hostelData, error: hostelError } = await supabase
      .from('hostels')
      .select('gender')
      .eq('hostelid', hostelId)
      .single();

    console.log('Step 5: Fetch Hostel Gender', { hostelData, hostelError });

    if (hostelError) {
      throw hostelError;
    }

    // 6. Check if the user's gender matches the hostel's gender
    if (hostelData.gender !== 'Co-ed' && hostelData.gender !== userGender) {
      return { success: false, message: `Gender mismatch. This hostel is for ${hostelData.gender} occupants.` };
    }

    // 7. Insert a new record into occupantDetails
    const { data: insertData, error: insertError } = await supabase
      .from('occupantdetails')
      .insert([
        {
          userid: userid,
          hostelid: hostelId,
          roomid: roomId,
        },
      ]);

    console.log('Step 7: Insert into occupantdetails', { insertData, insertError });

    if (insertError) {
      throw insertError;
    }

    // 8. Decrement the room's vacancies by 1
    const { data: updateRoomData, error: updateRoomError } = await supabase
      .from('hostelroomdetails')
      .update({ vacancies: roomData.vacancies - 1 })
      .eq('roomid', roomId)
      .eq('hostelid', hostelId)
      .single();

    console.log('Step 8: Update hostelroomdetails', { updateRoomData, updateRoomError });

    if (updateRoomError) {
      throw updateRoomError;
    }

    // 9. Update the user's hostelid and roomid in the users table
    const { data: updateUserData, error: updateUserError } = await supabase
      .from('users')
      .update({
        hostelid: hostelId,
        roomid: roomId,
      })
      .eq('id', userid)
      .single();

    console.log('Step 9: Update users table', { updateUserData, updateUserError });

    if (updateUserError) {
      throw updateUserError;
    }

    return { success: true, message: 'Successfully joined the hostel room!' };
  } catch (error) {
    console.error('Error applying to room:', error);
    return { success: false, message: error.message || 'An error occurred while applying to the room.' };
  }
};

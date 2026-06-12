import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      entry_type,
      // Hard day fields
      what_made_today_difficult,
      what_is_happening,
      decision_facing,
      facts_of_situation,
      what_is_true,
      experience_tells_me,
      advice_to_another,
      feeling_normal,
      how_feeling_now,
      what_need_most,
      emotions_to_process,
      releasing_and_keeping,
      what_got_through_today,
      tell_yourself_tomorrow,
      step_taken,
      hard_day_rating,
      // Victory fields
      victory_accomplished,
      victory_time_working,
      victory_almost_stopped,
      victory_kept_going,
      victory_what_it_took,
      victory_what_overcame,
      victory_surprised_self,
      victory_who_becoming,
      victory_how_feel,
      victory_strongest_emotion,
      victory_celebrate_with,
      victory_advice_to_others,
      victory_honor_how,
      victory_next_step,
      // Shared fields
      significance_rating,
      building_toward,
    } = body;

    const result = await sql`
      INSERT INTO clarity_journal_entries (
        user_id,
        entry_type,
        what_made_today_difficult,
        what_is_happening,
        decision_facing,
        facts_of_situation,
        what_is_true,
        experience_tells_me,
        advice_to_another,
        feeling_normal,
        how_feeling_now,
        what_need_most,
        emotions_to_process,
        releasing_and_keeping,
        what_got_through_today,
        tell_yourself_tomorrow,
        step_taken,
        hard_day_rating,
        victory_accomplished,
        victory_time_working,
        victory_almost_stopped,
        victory_kept_going,
        victory_what_it_took,
        victory_what_overcame,
        victory_surprised_self,
        victory_who_becoming,
        victory_how_feel,
        victory_strongest_emotion,
        victory_celebrate_with,
        victory_advice_to_others,
        victory_honor_how,
        victory_next_step,
        significance_rating,
        building_toward
      ) VALUES (
        ${session.user.id},
        ${entry_type},
        ${what_made_today_difficult || null},
        ${what_is_happening || null},
        ${decision_facing || null},
        ${facts_of_situation || null},
        ${what_is_true || null},
        ${experience_tells_me || null},
        ${advice_to_another || null},
        ${feeling_normal || null},
        ${how_feeling_now || null},
        ${what_need_most || null},
        ${emotions_to_process || null},
        ${releasing_and_keeping || null},
        ${what_got_through_today || null},
        ${tell_yourself_tomorrow || null},
        ${step_taken || null},
        ${hard_day_rating || null},
        ${victory_accomplished || null},
        ${victory_time_working || null},
        ${victory_almost_stopped || null},
        ${victory_kept_going || null},
        ${victory_what_it_took || null},
        ${victory_what_overcame || null},
        ${victory_surprised_self || null},
        ${victory_who_becoming || null},
        ${victory_how_feel || null},
        ${victory_strongest_emotion || null},
        ${victory_celebrate_with || null},
        ${victory_advice_to_others || null},
        ${victory_honor_how || null},
        ${victory_next_step || null},
        ${significance_rating || null},
        ${building_toward || null}
      )
      RETURNING id
    `;

    return Response.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error("Journal save error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

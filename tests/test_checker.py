from signoff.checker import count_words, run_checker


def test_word_counter_strips_citations_and_gaps():
    text = "We trained 1,240 workers [E2] with [GAP: pending UEI] across four port zip codes."
    assert count_words(text) == 10


def test_checker_catches_seeded_violations_then_passes_on_fix():
    initial = run_checker("grant", apply_fix=False)
    assert initial["passed"] is False
    assert len(initial["violations"]) == 2

    fixed = run_checker("grant", apply_fix=True)
    assert fixed["passed"] is True
    assert fixed["rules_passed"] == 8

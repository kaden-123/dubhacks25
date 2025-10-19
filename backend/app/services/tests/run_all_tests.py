#!/usr/bin/env python3
"""
Comprehensive test runner for all pose comparison tests
Runs all test suites and provides a summary report
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import time
from typing import Dict, List


def run_test_suite(test_name: str, test_module_name: str) -> Dict:
    """Run a single test suite and return results"""
    print("\n" + "=" * 70)
    print(f"RUNNING TEST SUITE: {test_name}")
    print("=" * 70)

    start_time = time.time()

    try:
        # Import and run the test module
        test_module = __import__(test_module_name)

        # Find the test class or run function
        if hasattr(test_module, 'TestAngleCalculator'):
            tester = test_module.TestAngleCalculator()
            success = tester.run_all_tests()
            passed = tester.passed
            failed = tester.failed
        elif hasattr(test_module, 'TestMotionAndTiming'):
            tester = test_module.TestMotionAndTiming()
            success = tester.run_all_tests()
            passed = tester.passed
            failed = tester.failed
        elif hasattr(test_module, 'TestIntegrationAPI'):
            tester = test_module.TestIntegrationAPI()
            success = tester.run_all_tests()
            passed = tester.passed
            failed = tester.failed
        elif hasattr(test_module, 'TestEdgeCasesAndStress'):
            tester = test_module.TestEdgeCasesAndStress()
            success = tester.run_all_tests()
            passed = tester.passed
            failed = tester.failed
        elif hasattr(test_module, 'PoseComparisonTester'):
            tester = test_module.PoseComparisonTester()
            success = tester.run_all_tests()
            passed = tester.passed_tests
            failed = tester.failed_tests
        elif hasattr(test_module, 'test_exact_reference_comparison'):
            # For test_exact_reference_comparison.py
            test1 = test_module.test_exact_reference_comparison()
            test2 = test_module.test_config_updates()
            success = test1 and test2
            passed = 2 if success else (1 if test1 or test2 else 0)
            failed = 0 if success else (1 if test1 or test2 else 2)
        else:
            print(f"⚠️  Could not find test class in {test_module_name}")
            return {
                'name': test_name,
                'success': False,
                'passed': 0,
                'failed': 0,
                'duration': 0,
                'error': 'No test class found'
            }

    except Exception as e:
        duration = time.time() - start_time
        print(f"\n❌ Test suite {test_name} crashed: {e}")
        import traceback
        traceback.print_exc()
        return {
            'name': test_name,
            'success': False,
            'passed': 0,
            'failed': 1,
            'duration': duration,
            'error': str(e)
        }

    duration = time.time() - start_time

    return {
        'name': test_name,
        'success': success,
        'passed': passed,
        'failed': failed,
        'duration': duration,
        'error': None
    }


def print_summary(results: List[Dict]):
    """Print comprehensive summary of all test results"""
    print("\n" + "=" * 70)
    print("COMPREHENSIVE TEST SUMMARY")
    print("=" * 70)

    total_passed = sum(r['passed'] for r in results)
    total_failed = sum(r['failed'] for r in results)
    total_duration = sum(r['duration'] for r in results)
    total_suites = len(results)
    successful_suites = sum(1 for r in results if r['success'])

    print(f"\n📊 Overall Statistics:")
    print(f"   Total Test Suites: {total_suites}")
    print(f"   Successful Suites: {successful_suites}")
    print(f"   Failed Suites: {total_suites - successful_suites}")
    print(f"   Total Individual Tests: {total_passed + total_failed}")
    print(f"   ✅ Passed Tests: {total_passed}")
    print(f"   ❌ Failed Tests: {total_failed}")
    print(f"   Total Duration: {total_duration:.2f}s")

    if total_passed + total_failed > 0:
        success_rate = (total_passed / (total_passed + total_failed)) * 100
        print(f"   Success Rate: {success_rate:.1f}%")

    print(f"\n📋 Suite-by-Suite Results:")
    for result in results:
        status = "✅" if result['success'] else "❌"
        print(f"\n   {status} {result['name']}")
        print(f"      Passed: {result['passed']}, Failed: {result['failed']}")
        print(f"      Duration: {result['duration']:.2f}s")
        if result['error']:
            print(f"      Error: {result['error']}")

    print("\n" + "=" * 70)

    if total_failed == 0:
        print("🎉 ALL TESTS PASSED! 🎉")
        print("The pose comparison system is working correctly.")
    else:
        print("⚠️  SOME TESTS FAILED")
        print("Please review the failures above and fix the issues.")

    print("=" * 70)


def main():
    """Main test runner"""
    print("🚀 COMPREHENSIVE POSE COMPARISON TEST SUITE")
    print("Running all tests...")

    test_suites = [
        ("Angle Calculator Tests", "test_angle_calculator"),
        ("Motion and Timing Tests", "test_motion_and_timing"),
        ("Integration API Tests", "test_integration_api"),
        ("Pose Comparison Tests", "test_pose_comparison"),
        ("Edge Cases and Stress Tests", "test_edge_cases_stress"),
        ("Exact Reference Comparison Tests", "test_exact_reference_comparison"),
    ]

    results = []

    for test_name, test_module in test_suites:
        result = run_test_suite(test_name, test_module)
        results.append(result)

        # Brief pause between test suites
        time.sleep(0.5)

    # Print comprehensive summary
    print_summary(results)

    # Exit with appropriate code
    total_failed = sum(r['failed'] for r in results)
    sys.exit(0 if total_failed == 0 else 1)


if __name__ == "__main__":
    main()

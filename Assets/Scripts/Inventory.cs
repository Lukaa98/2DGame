using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Inventory : MonoBehaviour
{

    public static Inventory Reference;
    public int KilledEnemys;
    public static Inventory Reference1;
    public int ThrownBirds;
    // Start is called before the first frame update
    void Awake()
    {
        Reference = this;
        Reference1 = this;

    }

} 